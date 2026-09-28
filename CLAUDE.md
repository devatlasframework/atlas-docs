# atlas-docs — house rules

**PUBLIC** copy of the ATLAS API contract (the OpenAPI description) and its changelog.
Audience: third-party developers.

**The docs site is not here** (ADR-0079 in `atlas`). Nav P10/D8 and the D9 quickstart are pages of
the web app (`atlas/apps/web`, `/docs`), rendered from the contract each release ships; their guides
are written there. This repository holds what the release mirror (`atlas-infra/scripts/mirror-api-spec.sh`)
copies: `api/openapi.yaml`, `changelog/CHANGELOG.md` and the `api/MIRROR.md` stamp.

## Rules

- **Public repo:** never document internal or unreleased endpoints, internal hostnames, or
  operational details; no secrets in examples — placeholder keys only (`ATLAS_API_KEY`).
- Plain English, second person, active voice — the same voice as the product (Design Guide
  §7). No jargon walls; explain the first use of every term.
- **Never edit the mirrored files by hand.** `api/openapi.yaml` and `changelog/CHANGELOG.md` are
  byte-for-byte copies; a fix goes into `atlas/packages/api-spec` and arrives with the next mirror.
  `verify-mirror` fails a change that breaks the stamp.
- Prose here (READMEs, `SECURITY.md`) explains what the files are and where they come from. Never let
  it contradict the contract — fix the contract first.
- Keep the changelog per released API change; breaking changes are announced clearly, never
  slipped in.
