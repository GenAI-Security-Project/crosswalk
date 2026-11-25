'use strict';
/**
 * crossrefs.js — the link graph between mapping files, shared by
 * scripts/validate.js (which warns about one-way links) and
 * scripts/backrefs.js (which writes the missing back-references).
 *
 * Both read the graph through this module so they cannot disagree about what
 * counts as a link, which files are checked, or how a path resolves.
 *
 *   - Files: every *.md directly under a mapping folder, except README.md.
 *   - Links: inline Markdown links `[text](target.md)` / `[text](target.md#x)`
 *     whose target ends in `.md` and resolves, relative to the linking file,
 *     to a file that exists.
 *   - A one-way link: mapping file A links mapping file B, and B does not
 *     link A.
 *
 * Generated back-reference blocks (BACKREFS_START … BACKREFS_END) are part of
 * a file's content, so the validator counts the links inside them. The
 * generator reads the graph with `authoredOnly`, which drops those blocks
 * first: what it writes is derived from authored links only, which makes its
 * output a fixed point.
 */

const fs   = require('fs');
const path = require('path');

const MAPPING_FOLDERS = [
  'llm-top10',
  'agentic-top10',
  'dsgai-2026',
  'ast-top10',
];

const BACKREFS_START = '<!-- backrefs:start -->';
const BACKREFS_END   = '<!-- backrefs:end -->';

// A block plus the newlines on either side of it. Removing it puts back one
// blank line (or, at end of file, a single trailing newline) — exactly what
// backrefs.js inserts around it, so insert-then-strip is the identity.
const BLOCK_RE = /\n*<!-- backrefs:start -->[\s\S]*?<!-- backrefs:end -->\n*/g;

/** Remove every generated back-reference block, leaving authored content. */
function stripBackrefs(content) {
  return content.replace(BLOCK_RE, (m, offset, whole) => {
    const atStart = offset === 0;
    const atEnd = offset + m.length === whole.length;
    if (atStart) return '';
    return atEnd ? '\n' : '\n\n';
  });
}

/** Every mapping file under `root`, in folder order then directory order. */
function collectMappingFiles(root) {
  const files = [];
  for (const folder of MAPPING_FOLDERS) {
    const dir = path.join(root, folder);
    if (!fs.existsSync(dir)) continue;
    for (const filename of fs.readdirSync(dir)) {
      // A directory README is documentation, not a mapping file: it has no
      // framework, no entries and no quick-reference table to validate.
      if (filename.endsWith('.md') && filename.toLowerCase() !== 'readme.md') {
        files.push(path.join(dir, filename));
      }
    }
  }
  return files;
}

/** Absolute paths of the existing .md files `content` (of file `fp`) links to. */
function linkTargets(fp, content) {
  const targets = new Set();
  const linkRe = /\[([^\]]*)\]\(([^)#)]+\.md)[^)]*\)/g;
  let match;
  while ((match = linkRe.exec(content)) !== null) {
    const target = path.resolve(path.dirname(fp), match[2]);
    if (fs.existsSync(target)) targets.add(target);
  }
  return targets;
}

/**
 * filePath → Set of the .md files it links to.
 * `authoredOnly` ignores links inside generated back-reference blocks.
 */
function buildCrossRefMap(files, { authoredOnly = false } = {}) {
  const map = {};
  for (const fp of files) {
    let content = fs.readFileSync(fp, 'utf8').replace(/\r\n/g, '\n');
    if (authoredOnly) content = stripBackrefs(content);
    map[path.resolve(fp)] = linkTargets(fp, content);
  }
  return map;
}

/** True when `fp` sits inside one of the mapping folders of `root`. */
function isMappingPath(root, fp) {
  const rel = path.relative(root, fp).split(path.sep);
  return rel.length > 1 && MAPPING_FOLDERS.includes(rel[0]);
}

/**
 * Every link A → B where B is in a mapping folder and B does not link back
 * to A. Returns [{ from, to }] with absolute paths, in `files` order.
 *
 * B need not be in `files`: a folder README (not a mapping file, so not in
 * the set) is read on demand, so a README that does link back is not
 * reported. It used to be — its links were never read.
 */
function findOneWayLinks(root, files, map) {
  const out = [];
  const extra = {};
  const linksOf = (fp) => {
    if (map[fp]) return map[fp];
    if (!extra[fp]) extra[fp] = linkTargets(fp, fs.readFileSync(fp, 'utf8'));
    return extra[fp];
  };
  for (const fp of files) {
    const from = path.resolve(fp);
    for (const to of map[from] || []) {
      if (!isMappingPath(root, to)) continue;
      if (!linksOf(to).has(from)) out.push({ from, to });
    }
  }
  return out;
}

module.exports = {
  MAPPING_FOLDERS,
  BACKREFS_START,
  BACKREFS_END,
  stripBackrefs,
  collectMappingFiles,
  linkTargets,
  buildCrossRefMap,
  isMappingPath,
  findOneWayLinks,
};
