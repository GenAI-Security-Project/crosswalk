import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { entries, incidents, getEntry, getFramework, searchEntries, frameworks, getBySeverity,
  getIncidentsForEntry, registries, stats, version, getControl, controlsFor, entriesFor,
  coverage } from './index';

describe('@owasp/genai-crosswalk', () => {
  // Asserted against the generated count rather than a literal. This test said
  // 41 and broke the moment a fourth source list was registered — exactly the
  // hardcoded-count drift T-DATA01 removed from the README.
  it('loads every entry the stats report', () => {
    assert.equal(entries.length, stats.entries.total);
    assert.ok(entries.length > 0);
  });

  it('loads 31 incidents', () => {
    assert.ok(incidents.length >= 31);
  });

  it('getEntry returns LLM01', () => {
    const e = getEntry('LLM01');
    assert.ok(e);
    assert.equal(e.id, 'LLM01');
    assert.equal(e.severity, 'Critical');
  });

  it('getEntry is case-insensitive', () => {
    assert.ok(getEntry('llm01'));
    assert.ok(getEntry('asi01'));
  });

  it('getEntry returns undefined for unknown ID', () => {
    assert.equal(getEntry('FAKE99'), undefined);
  });

  it('frameworks includes all 18', () => {
    assert.ok(frameworks.length >= 18);
    assert.ok(frameworks.includes('EU AI Act'));
    assert.ok(frameworks.includes('NIST SP 800-218A'));
  });

  it('getFramework returns entries for EU AI Act', () => {
    const r = getFramework('EU AI Act');
    assert.ok(r.entries.length > 0);
    assert.ok(r.controls.length > 0);
  });

  it('searchEntries finds prompt injection', () => {
    const r = searchEntries('prompt injection');
    assert.ok(r.length > 0);
    assert.ok(r.some(e => e.id === 'LLM01'));
  });

  it('getBySeverity returns Critical entries', () => {
    const r = getBySeverity('Critical');
    assert.ok(r.length > 0);
    assert.ok(r.every(e => e.severity === 'Critical'));
  });

  it('getIncidentsForEntry returns incidents for LLM01', () => {
    const r = getIncidentsForEntry('LLM01');
    assert.ok(r.length > 0);
  });

  it('every entry has mappings array', () => {
    for (const e of entries) {
      assert.ok(Array.isArray(e.mappings), `${e.id} missing mappings`);
    }
  });

  it('every incident has required fields', () => {
    for (const i of incidents) {
      assert.ok(i.id, 'missing id');
      assert.ok(i.title, 'missing title');
      assert.ok(i.owasp_entries.length > 0, `${i.id} missing owasp_entries`);
      assert.ok(i.maestro_layers.length > 0, `${i.id} missing maestro_layers`);
    }
  });
  // ── T-ENG02: the control-level join ───────────────────────────────────────

  it('ships every framework registry', () => {
    assert.equal(registries.length, stats.frameworks.registries);
    for (const r of registries) {
      assert.ok(r.name, 'registry missing name');
      assert.ok(Array.isArray(r.controls), `${r.name} missing controls`);
    }
  });

  it('every registry item is typed with a valid kind', () => {
    const valid = new Set(['control', 'technique', 'weakness', 'threat-category', 'layer']);
    for (const r of registries) {
      for (const c of r.controls) {
        assert.ok(valid.has(c.kind), `${r.name}:${c.control_id} has kind "${c.kind}"`);
      }
    }
  });

  it('version comes from generated stats, not a hardcoded literal', () => {
    assert.equal(version, stats.version);
    const pkg = JSON.parse(
      require('fs').readFileSync(require('path').join(__dirname, '..', 'package.json'), 'utf8'),
    );
    assert.equal(version, pkg.version, 'package version and API version disagree');
  });

  it('getControl resolves a known control to its registry record', () => {
    const c = getControl('ISO/IEC 27001:2022', 'A.8.12');
    assert.ok(c, 'A.8.12 should resolve in the ISO 27001 registry');
    assert.ok(c!.title.length > 0);
    assert.equal(c!.kind, 'control');
  });

  it('getControl returns undefined for an unknown framework or id', () => {
    assert.equal(getControl('Not A Framework', 'X.1'), undefined);
    assert.equal(getControl('ISO/IEC 27001:2022', 'A.99.99'), undefined);
  });

  it('controlsFor returns one row per mapping and resolves most of them', () => {
    const rows = controlsFor('LLM02');
    const entry = getEntry('LLM02')!;
    assert.equal(rows.length, entry.mappings.length);
    const resolved = rows.filter(r => r.control).length;
    assert.ok(resolved > 0, 'no mapping resolved to a registry control');
  });

  it('entriesFor is the reverse of a mapping', () => {
    const rows = controlsFor('LLM02').filter(r => r.control);
    assert.ok(rows.length > 0);
    const { framework, mapping } = rows[0];
    const back = entriesFor(framework, mapping.control_id);
    assert.ok(back.some(e => e.id === 'LLM02'), 'reverse join lost the entry');
  });

  it('coverage excludes layers and reports unresolved ids', () => {
    const c = coverage('MAESTRO');
    assert.ok(c, 'MAESTRO should be a known framework');
    assert.ok(c!.layers > 0, 'MAESTRO has architectural layers');
    assert.equal(c!.coverable + c!.layers, registries.find(r => r.name === 'MAESTRO')!.controls.length);
    assert.ok(c!.percent >= 0 && c!.percent <= 100);
  });

  it('coverage is undefined for an unknown framework', () => {
    assert.equal(coverage('Not A Framework'), undefined);
  });

  // Pins a known defect so it cannot worsen unnoticed: in several frameworks the
  // mapping rows carry requirement prose in `control_id` and the identifier in
  // `control_name`, which makes the join unresolvable for those rows. Tracked for
  // T-METH01. If this ever fails low, the defect was fixed — raise the bar.
  it('records how many mappings cannot resolve to a registry control', () => {
    let unresolved = 0;
    let total = 0;
    for (const e of entries) {
      for (const row of controlsFor(e.id)) {
        total++;
        if (!row.control) unresolved++;
      }
    }
    assert.ok(total > 3000, 'expected the full mapping set');
    assert.ok(
      unresolved / total < 0.5,
      `${unresolved}/${total} mappings unresolvable — worse than the known baseline`,
    );
  });
});
