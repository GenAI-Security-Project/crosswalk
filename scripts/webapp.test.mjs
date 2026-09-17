/**
 * Smoke test for the webapp in docs/.
 *
 * Nothing else in CI loads docs/index.html. A blank About page shipped that
 * way: a timeline entry was missing its trailing comma, the next entry parsed
 * as an index into it, and the TypeError that followed left #app empty. Every
 * other job stayed green because none of them executes the page.
 *
 * This renders the real page — the same index.html and the same five generated
 * bundles the site serves — and walks every route in the router table. A route
 * fails if it throws, or if it leaves #app empty.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const INDEX = path.join(DOCS, 'index.html');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

/**
 * Serve docs/ over loopback. The page keeps state in localStorage, which jsdom
 * refuses to hand out on a file:// origin, so the test needs a real one. Only
 * files under docs/ are served, and nothing leaves the machine.
 */
function serveDocs() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.join(DOCS, rel);
    if (!file.startsWith(DOCS + path.sep)) { res.writeHead(403).end(); return; }
    try {
      const body = readFileSync(file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/** Route keys declared in the `var routes = { ... }` table in index.html. */
function declaredRoutes(html) {
  const table = html.match(/var routes = \{([\s\S]*?)\n {2}\};/);
  assert.ok(table, 'could not find the routes table in index.html — has the router moved?');
  return [...table[1].matchAll(/'([^']+)':\s*\w+/g)].map((m) => m[1]);
}

let dom;
let server;
let errors = [];

before(async () => {
  const virtualConsole = new VirtualConsole();
  // jsdom reports uncaught page exceptions here; console.error is a signal too.
  virtualConsole.on('jsdomError', (e) => errors.push(e));
  virtualConsole.on('error', (...args) => errors.push(new Error(args.join(' '))));

  server = await serveDocs();
  const { port } = server.address();

  dom = new JSDOM(readFileSync(INDEX, 'utf8'), {
    url: `http://127.0.0.1:${port}/index.html`,
    runScripts: 'dangerously',
    resources: 'usable', // pulls in data.js, incidents.js, backlinks.js, …
    pretendToBeVisual: true,
    virtualConsole,
    // Two browser APIs jsdom does not implement. The page asks matchMedia for
    // the OS colour-scheme preference and calls scrollTo on every navigation;
    // neither decides what gets rendered, so a no-op stands in for both.
    beforeParse(window) {
      window.matchMedia = (query) => ({
        media: query, matches: false, onchange: null,
        addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
      });
      window.scrollTo = () => {};
    },
  });

  // Wait for the five generated bundles to load and the app to boot.
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('the page did not finish loading in 60s')), 60_000);
    dom.window.addEventListener('load', () => { clearTimeout(timer); resolve(); });
  });

  assert.deepEqual(errors, [], 'the page raised an error while loading');
  assert.ok(dom.window.CROSSWALK_DATA, 'docs/data.js did not load — CROSSWALK_DATA is not defined');
  assert.ok(dom.window.CROSSWALK_INCIDENTS, 'docs/incidents.js did not load');
  assert.ok(dom.window.CROSSWALK_FRAMEWORKS, 'docs/frameworks-registry.js did not load');
});

after(() => { dom?.window.close(); server?.close(); });

/** Navigate to `hash` and return the rendered #app element. */
function visit(hash) {
  const { window } = dom;
  errors = [];
  window.location.hash = hash;
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  return window.document.getElementById('app');
}

test('every route in the router table renders something', (t) => {
  const routes = declaredRoutes(readFileSync(INDEX, 'utf8'));
  assert.ok(routes.length >= 15, `expected the full route table, got ${routes.length}`);

  for (const route of routes) {
    const app = visit('#' + route);
    assert.deepEqual(errors.map(String), [], `${route} raised an error`);
    assert.ok(app.children.length > 0, `${route} rendered an empty page`);
    assert.ok(app.textContent.trim().length > 50, `${route} rendered almost no text`);
  }
  t.diagnostic(`${routes.length} routes rendered`);
});

test('the deep-link routes render', () => {
  const { window } = dom;
  const entryId = window.CROSSWALK_DATA[0].id;
  const incidentId = window.CROSSWALK_INCIDENTS[0].id;
  const framework = window.CROSSWALK_FRAMEWORKS[0].name;

  for (const hash of [
    `#/explorer/${entryId}`,
    `#/incidents/${incidentId}`,
    `#/frameworks/${encodeURIComponent(framework)}`,
  ]) {
    const app = visit(hash);
    assert.deepEqual(errors.map(String), [], `${hash} raised an error`);
    assert.ok(app.children.length > 0, `${hash} rendered an empty page`);
  }
});

test('an unknown route falls back to a page, not a blank screen', () => {
  const app = visit('#/no-such-route');
  assert.deepEqual(errors.map(String), []);
  assert.ok(app.children.length > 0, 'the fallback rendered an empty page');
});

// The About page is the one place in the webapp allowed to carry the creator
// credit, and this file is not — so the test checks that the section renders
// with content, never the name itself.
test('the About page renders its credit, initiative and licence sections', () => {
  const app = visit('#/about');
  const headings = [...app.querySelectorAll('h2, h3')].map((h) => h.textContent);

  assert.ok(headings.some((h) => /Creator/i.test(h)), 'the credit section is missing');
  const credit = [...app.querySelectorAll('h3')].find((h) => /Creator/i.test(h.textContent));
  assert.ok(credit.nextElementSibling?.textContent.trim().length > 40, 'the credit section rendered empty');

  assert.match(app.textContent, /OWASP GenAI Data Security Initiative/);
  assert.match(app.textContent, /CC BY-SA 4\.0|Creative Commons/);

  // The timeline is what the missing comma broke: every row needs both halves.
  const rows = [...app.querySelectorAll('.timeline-item')];
  assert.ok(rows.length >= 7, `expected the full project timeline, got ${rows.length} rows`);
  for (const row of rows) {
    assert.ok(row.querySelector('.timeline-date')?.textContent.trim(), 'a timeline row has no date');
    assert.ok(row.querySelector('.timeline-text')?.textContent.trim(), 'a timeline row has no text');
  }
});
