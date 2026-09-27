
// Rescue engine: Investigate -> Analyze -> Plan -> Rescue -> Test -> Review.
// Patch generation produces a real diff against the real file. Nothing is
// written to disk until /api/rescue is called with action:"apply" AND the
// patch has already been marked reviewed — enforced server-side, not just
// in the UI.
const fs = require('fs');
const path = require('path');
const { MODULES } = require('./moduleRegistry');
const { readSource } = require('./analyzer');
const { runTests } = require('./testRunner');
const bobAdapter = require('./bobAdapter');

const PHASES = ['investigate', 'analyze', 'plan', 'rescue', 'test', 'review'];

// Same three real patches as the in-browser workbench, defined once here
// as the source of truth for the full-stack version.
const PATCHES = {
  'payment-refund': {
    moduleKey: 'payment',
    summary: "Implement refundPayment() so it returns a real refund result instead of throwing 'not implemented'.",
    newSource:
`// Mock payment gateway integration for the demo checkout flow.

function createPayment(amount, details) {
  if (!details || !details.cardNumber) {
    return { success: false, reason: 'missing_card' };
  }
  // Raw card number is inspected directly in application code.
  var approved = amount > 0 && details.cardNumber.length === 16;
  if (!approved) return { success: false, reason: 'declined' };
  return { success: true, transactionId: 'txn_' + Date.now() };
}

function refundPayment(transactionId, amount) {
  if (!transactionId) {
    return { success: false, reason: 'missing_transaction_id' };
  }
  if (!(amount > 0)) {
    return { success: false, reason: 'invalid_amount' };
  }
  return { success: true, refundId: 'rfnd_' + Date.now(), transactionId: transactionId, amount: amount };
}

module.exports = { createPayment: createPayment, refundPayment: refundPayment };
`
  },
  'cart-qty': {
    moduleKey: 'cart',
    summary: 'Validate that qty is a positive integer in addItem(), rejecting invalid values before they can reach calculateTotal().',
    newSource:
`var product = require('../products/product');

function createCart() {
  return { items: [], promoCode: null, discount: 0 };
}

function addItem(cart, productId, qty) {
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error('Invalid quantity: qty must be a positive integer');
  }
  cart.items.push({ productId: productId, qty: qty });
  return cart;
}

function applyPromoCode(cart, code) {
  // Promo codes hardcoded directly in source rather than loaded from a managed config.
  var PROMO_CODES = { SAVE10: 0.10, SAVE20: 0.20, VIP50: 0.50 };
  if (PROMO_CODES.hasOwnProperty(code)) {
    cart.promoCode = code;
    cart.discount = PROMO_CODES[code];
    return true;
  }
  return false;
}

function calculateTotal(cart) {
  var subtotal = cart.items.reduce(function(sum, item){
    return sum + product.getPrice(item.productId) * item.qty;
  }, 0);
  return +(subtotal * (1 - (cart.discount || 0))).toFixed(2);
}

module.exports = { createCart: createCart, addItem: addItem, applyPromoCode: applyPromoCode, calculateTotal: calculateTotal };
`
  },
  'orders-status': {
    moduleKey: 'orders',
    summary: 'Add an allowed-status list and reject updateOrderStatus() calls with an unrecognized status instead of writing it silently.',
    newSource:
`// In-memory order store for the demo.

var orders = [];
var ALLOWED_STATUSES = ['CREATED', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED'];

function createOrder(cart, paymentResult) {
  var order = {
    id: 'ord_' + (orders.length + 1),
    items: cart.items,
    status: 'CREATED',
    transactionId: paymentResult.transactionId
  };
  orders.push(order);
  return order;
}

function updateOrderStatus(orderId, status) {
  if (ALLOWED_STATUSES.indexOf(status) === -1) {
    throw new Error('Invalid order status: ' + status);
  }
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id === orderId) { orders[i].status = status; return orders[i]; }
  }
  return null;
}

module.exports = { createOrder: createOrder, updateOrderStatus: updateOrderStatus, orders: orders };
`
  }
};

// In-memory server-side state for the review gate. Resets on server restart.
const workbenchState = {}; // { [findingId]: { generated, reviewed, applied, appliedAt } }
function stateFor(id) {
  if (!workbenchState[id]) workbenchState[id] = { generated: false, reviewed: false, applied: false, appliedAt: null };
  return workbenchState[id];
}

// Minimal LCS line-diff — a genuine computed diff, not a cosmetic highlight.
function diffLines(oldText, newText) {
  const a = oldText.split('\n'), b = newText.split('\n');
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ type: 'ctx', text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: 'del', text: a[i] }); i++; }
    else { out.push({ type: 'add', text: b[j] }); j++; }
  }
  while (i < n) { out.push({ type: 'del', text: a[i] }); i++; }
  while (j < m) { out.push({ type: 'add', text: b[j] }); j++; }
  return out;
}

async function getPhases() {
  const bobStatus = await bobAdapter.generateRescuePlan({ phases: PHASES });
  return { phases: PHASES, bob: bobStatus };
}

function getWorkbench() {
  return Object.keys(PATCHES).map(id => {
    const patch = PATCHES[id];
    const st = stateFor(id);
    return {
      findingId: id,
      module: patch.moduleKey,
      file: MODULES[patch.moduleKey].relFile,
      summary: patch.summary,
      generated: st.generated,
      reviewed: st.reviewed,
      applied: st.applied,
      appliedAt: st.appliedAt
    };
  });
}

async function generatePatch(findingId) {
  const patch = PATCHES[findingId];
  if (!patch) return { ok: false, error: 'Unknown findingId' };
  const bobStatus = await bobAdapter.generateRescuePlan({ findingId });
  const original = readSource(patch.moduleKey);
  const diff = diffLines(original, patch.newSource);
  stateFor(findingId).generated = true;
  return { ok: true, findingId, file: MODULES[patch.moduleKey].relFile, diff, summary: patch.summary, bob: bobStatus };
}

async function reviewPatch(findingId, reviewed) {
  const patch = PATCHES[findingId];
  if (!patch) return { ok: false, error: 'Unknown findingId' };
  const st = stateFor(findingId);
  if (!st.generated) return { ok: false, error: 'Patch must be generated before it can be reviewed' };
  st.reviewed = !!reviewed;
  const bobStatus = await bobAdapter.reviewRescueAction({ findingId, reviewed: st.reviewed });
  return { ok: true, findingId, reviewed: st.reviewed, bob: bobStatus };
}

// Apply is the ONLY function that writes to disk. It refuses to run unless
// the patch was both generated and explicitly marked reviewed — this is
// enforced here, server-side, not just disabled in the UI.
async function applyPatch(findingId) {
  const patch = PATCHES[findingId];
  if (!patch) return { ok: false, error: 'Unknown findingId' };
  const st = stateFor(findingId);
  if (!st.generated) return { ok: false, error: 'Generate the patch before applying it' };
  if (!st.reviewed) return { ok: false, error: 'Patch must be marked reviewed by a human before it can be applied' };
  if (st.applied) return { ok: false, error: 'Patch already applied' };

  const mod = MODULES[patch.moduleKey];
  const original = readSource(patch.moduleKey);
  const backupPath = mod.file + '.bak-' + Date.now();
  fs.writeFileSync(backupPath, original, 'utf8'); // preserve original, auditable
  fs.writeFileSync(mod.file, patch.newSource, 'utf8');

  st.applied = true;
  st.appliedAt = new Date().toISOString();

  const testResults = runTests();
  const affected = testResults.results.find(r => r.file === mod.relFile && r.kind === 'gap');

  return {
    ok: true,
    findingId,
    file: mod.relFile,
    backupFile: path.basename(backupPath),
    appliedAt: st.appliedAt,
    retest: affected || null,
    fullTestSummary: testResults.summary
  };
}

function resetPatch(findingId) {
  // Restores the most recent backup, for demo repeatability.
  const patch = PATCHES[findingId];
  if (!patch) return { ok: false, error: 'Unknown findingId' };
  const mod = MODULES[patch.moduleKey];
  const dir = path.dirname(mod.file);
  const base = path.basename(mod.file);
  const backups = fs.readdirSync(dir).filter(f => f.startsWith(base + '.bak-')).sort();
  if (!backups.length) return { ok: false, error: 'No backup found to restore' };
  const latest = backups[backups.length - 1];
  const original = fs.readFileSync(path.join(dir, latest), 'utf8');
  fs.writeFileSync(mod.file, original, 'utf8');
  workbenchState[findingId] = { generated: false, reviewed: false, applied: false, appliedAt: null };
  return { ok: true, restoredFrom: latest };
}

module.exports = { PHASES, PATCHES, getPhases, getWorkbench, generatePatch, reviewPatch, applyPatch, resetPatch, diffLines };

