// IBM Bob integration boundary.
//
// This is the ONLY file that should change if real IBM Bob API/CLI
// credentials become available. Every function below checks for real
// configuration first; if it is not present, it returns a clearly-labeled
// "not connected" result instead of a fake Bob response. Nothing in this
// file invents an API call, an endpoint, or a credential.
//
// Expected real configuration (not currently set in this environment):
//   BOB_API_URL   - base URL for a real IBM Bob API/CLI bridge
//   BOB_API_KEY   - credential for that API
//
// If both are present, the functions below would make the real call
// instead of falling through to the local rescue engine. Since neither
// is set here, every call below honestly reports local-engine fallback.

function bobConfigured() {
  return !!(process.env.BOB_API_URL && process.env.BOB_API_KEY);
}

function notConnectedResult(operation) {
  return {
    connected: false,
    source: 'local-rescue-engine',
    operation,
    message: 'Bob integration not connected — using local rescue engine.'
  };
}

async function analyzeWithBob(payload) {
  if (!bobConfigured()) return notConnectedResult('analyzeWithBob');
  // Real integration would go here, e.g.:
  // const res = await fetch(process.env.BOB_API_URL + '/analyze', { ... });
  // return { connected: true, source: 'ibm-bob', ...await res.json() };
  return notConnectedResult('analyzeWithBob');
}

async function generateRescuePlan(payload) {
  if (!bobConfigured()) return notConnectedResult('generateRescuePlan');
  return notConnectedResult('generateRescuePlan');
}

async function reviewRescueAction(payload) {
  if (!bobConfigured()) return notConnectedResult('reviewRescueAction');
  return notConnectedResult('reviewRescueAction');
}

module.exports = { bobConfigured, analyzeWithBob, generateRescuePlan, reviewRescueAction };
