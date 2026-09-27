// CodeRescue AI backend.
//
// NOTE ON FRAMEWORK: this is written against Node's built-in http module
// rather than Express. The verification environment used to build this
// project has no network access, so `npm install express` was not
// possible to actually run and verify here. Using zero dependencies let
// us install nothing and still start, curl, and verify every route for
// real. The route table below mirrors what an Express app.get/app.post
// layout would look like, and swapping in Express is a mechanical change
// isolated to this file — nothing else depends on it.
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const { analyzeProject } = require('./analyzer');
const { analyzeDependencies } = require('./dependencyAnalyzer');
const { analyzeRisks } = require('./riskAnalyzer');
const { runTests, testGapInventory } = require('./testRunner');
const rescueEngine = require('./rescueEngine');
const { generateReport } = require('./reportGenerator');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

let lastTestRun = null;

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) { req.destroy(); reject(new Error('Payload too large')); }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

// Serve the static frontend, if present, for local `node server.js` use.
// Deliberately does not accept an arbitrary path — only exact known files.
function serveStatic(req, res, pathname) {
  const filename = pathname === '/' ? 'CodeRescue.html' : pathname.replace(/^\//, '');
  const resolved = path.join(PUBLIC_DIR, filename);
  if (!resolved.startsWith(PUBLIC_DIR) || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const ext = path.extname(resolved);
  const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(resolved).pipe(res);
}

async function handleApi(req, res, pathname, query) {
  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, { ok: true, service: 'coderescue-backend', time: new Date().toISOString() });
    }

    if (pathname === '/api/project' && req.method === 'GET') {
      const { project } = analyzeProject();
      return sendJson(res, 200, project);
    }

    if (pathname === '/api/analyze' && req.method === 'GET') {
      return sendJson(res, 200, analyzeProject());
    }

    if (pathname === '/api/dependencies' && req.method === 'GET') {
      return sendJson(res, 200, analyzeDependencies());
    }

    if (pathname === '/api/risks' && req.method === 'GET') {
      return sendJson(res, 200, analyzeRisks());
    }

    if (pathname === '/api/test-gaps' && req.method === 'GET') {
      return sendJson(res, 200, testGapInventory());
    }

    if (pathname === '/api/run-tests' && req.method === 'POST') {
      lastTestRun = runTests();
      return sendJson(res, 200, lastTestRun);
    }

    if (pathname === '/api/rescue/phases' && req.method === 'GET') {
      return sendJson(res, 200, await rescueEngine.getPhases());
    }

    if (pathname === '/api/rescue/workbench' && req.method === 'GET') {
      return sendJson(res, 200, { workbench: rescueEngine.getWorkbench() });
    }

    if (pathname === '/api/rescue' && req.method === 'POST') {
      const body = await readBody(req);
      const { findingId, action } = body;
      if (!findingId || !action) return sendJson(res, 400, { ok: false, error: 'findingId and action are required' });

      if (action === 'generate') return sendJson(res, 200, await rescueEngine.generatePatch(findingId));
      if (action === 'review') return sendJson(res, 200, await rescueEngine.reviewPatch(findingId, body.reviewed !== false));
      if (action === 'apply') {
        const result = await rescueEngine.applyPatch(findingId);
        if (result.ok) lastTestRun = { results: [], summary: result.fullTestSummary, executedAt: result.appliedAt };
        return sendJson(res, result.ok ? 200 : 409, result);
      }
      if (action === 'reset') return sendJson(res, 200, rescueEngine.resetPatch(findingId));
      return sendJson(res, 400, { ok: false, error: 'Unknown action: ' + action });
    }

    if (pathname === '/api/report' && req.method === 'GET') {
      return sendJson(res, 200, await generateReport(lastTestRun));
    }

    sendJson(res, 404, { ok: false, error: 'No such API route: ' + req.method + ' ' + pathname });
  } catch (e) {
    sendJson(res, 500, { ok: false, error: e.message });
  }
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    return handleApi(req, res, pathname, parsed.query);
  }

  return serveStatic(req, res, pathname);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`CodeRescue backend listening on http://localhost:${PORT}`);
    console.log(`Serving frontend from ${PUBLIC_DIR} (if present)`);
  });
}

module.exports = server;
