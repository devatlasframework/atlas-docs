// Checks that the mirrored API contract is the one its stamp names.
//
// api/openapi.yaml and changelog/CHANGELOG.md are byte-for-byte copies of the
// contract in the (private) atlas monorepo, written at a release cut by
// atlas-infra/scripts/mirror-api-spec.sh together with api/MIRROR.md. This
// check fails if either file stops matching the checksum in that stamp, or if
// the stamp, the spec's info.version and the changelog's newest entry disagree
// about which contract version this is.
//
// WHAT IT CANNOT DO: it cannot see the source repository, so it cannot prove
// these bytes are the ones the release branch holds. That is checked where the
// source is visible - the mirror script refuses unless the release branch's
// spec-lint and api-verify jobs passed at the exact commit it copies. This
// check keeps the copy honest after it lands: a hand edit here fails.
//
// No dependencies, so nothing to install. Run from the repo root:
//   node .github/scripts/verify-mirror.mjs

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const STAMP = 'api/MIRROR.md';
const SPEC = 'api/openapi.yaml';
const LOG = 'changelog/CHANGELOG.md';
const problems = [];

if (!existsSync(STAMP)) {
  console.log(`${STAMP} absent: no contract has been mirrored yet, nothing to verify.`);
  process.exit(0);
}

const stamp = readFileSync(STAMP, 'utf8');
function field(label) {
  const row = stamp.split(/\r?\n/).find((l) => l.startsWith(`| ${label} | `));
  const m = row && row.slice(`| ${label} | `.length).match(/^`([^`]*)`/);
  if (!m) problems.push(`${STAMP} has no "${label}" row`);
  return m ? m[1] : undefined;
}

const version = field('Contract version');
for (const [path, label] of [
  [SPEC, '`api/openapi.yaml` sha256'],
  [LOG, '`changelog/CHANGELOG.md` sha256'],
]) {
  const expected = field(label);
  if (!existsSync(path)) {
    problems.push(`${path} is missing but ${STAMP} names it`);
    continue;
  }
  const actual = createHash('sha256').update(readFileSync(path)).digest('hex');
  if (expected && actual !== expected) {
    problems.push(`${path} sha256 is ${actual}, the stamp says ${expected} - edit the contract in atlas and re-mirror, never here`);
  }
}

// info.version: the first `version:` indented two spaces under the top-level `info:` key.
const spec = existsSync(SPEC) ? readFileSync(SPEC, 'utf8') : '';
const info = spec.match(/^info:\r?\n((?:[ #].*\r?\n|\r?\n)*)/m);
const specVersion = info && info[1].match(/^ {2}version:\s*['"]?([^'"\s]+)/m)?.[1];
const log = existsSync(LOG) ? readFileSync(LOG, 'utf8') : '';
const logTop = log.match(/^## (\d+\.\d+\.\d+)/m)?.[1];

if (specVersion !== version) problems.push(`${SPEC} info.version is ${specVersion ?? 'absent'}, the stamp says ${version}`);
if (logTop !== version) problems.push(`${LOG}'s newest entry is ${logTop ?? 'absent'}, the stamp says ${version}`);

if (problems.length) {
  for (const p of problems) console.error(`verify-mirror: ${p}`);
  process.exit(1);
}
console.log(`verify-mirror: contract ${version} - both files match the stamp, and the spec and changelog agree.`);
