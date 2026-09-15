/**
 * text-integrity.test.mjs — no control bytes in tracked text files.
 *
 * Three scripts on main carried raw control bytes where an escape sequence was
 * intended: NUL key separators in export-olir.mjs and density-report.js, and
 * two backspace bytes where audit-incidents.mjs meant the regex word boundary
 * "backslash b". Git classifies such files as binary, so their diffs were never
 * shown in review, and the audit regex silently could not match anything.
 *
 * The check works on byte values so this file itself contains no escapes that
 * an editor or tool could turn back into the bytes it is looking for.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEXT = /\.(js|mjs|cjs|ts|json|md|yml|yaml|py|sh|toml|jsonc|html|css|txt|csv|svg|xml)$/i;
const TAB = 9;
const LF = 10;
const CR = 13;
const DEL = 127;

test('tracked text files contain no control bytes', () => {
  const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/).filter((f) => f && TEXT.test(f) && fs.existsSync(path.join(ROOT, f)));
  assert.ok(files.length > 100, `expected the repository's text files, found ${files.length}`);

  const offenders = [];
  for (const f of files) {
    const buf = fs.readFileSync(path.join(ROOT, f));
    let line = 1;
    for (let i = 0; i < buf.length; i++) {
      const b = buf[i];
      if (b === LF) line++;
      if ((b < 32 && b !== TAB && b !== LF && b !== CR) || b === DEL) {
        offenders.push(`${f}:${line} byte ${b}`);
        break;
      }
    }
  }
  assert.deepEqual(offenders, [], `control bytes found (one per file shown): ${offenders.join('; ')}`);
});
