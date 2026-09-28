# atlas-docs

**Public** copy of the ATLAS API contract: the OpenAPI description and its changelog, mirrored from
the `atlas` monorepo at each release. Audience: third-party developers building on "the
personalisation layer for e-learning".

**The developer documentation is not built from this repository.** It is served by the ATLAS web
app at `/docs` (and `/dev/docs` inside the developer portal), rendered from the contract each release
ships, and its guides are written in `atlas`. This repository is where that same contract is
published in the open, byte for byte, with a stamp saying which version it is.

## Layout

| Path | What |
|---|---|
| `api/` | The published OpenAPI description, mirrored from `atlas` → `packages/api-spec` at each release cut; `api/MIRROR.md` names the contract version |
| `changelog/` | The API contract's changelog, one entry per contract version (mirrored with the spec) |

## Prerequisites

> Node 22, for the checks below. There is no site toolchain here: the docs pages are the web app's.

## How to run it locally / tests

> CI runs markdownlint, gitleaks and `verify-mirror`; run the last locally with
> `node .github/scripts/verify-mirror.mjs`. The docs pages' links are checked where they are
> built, in the web app's own tests.

## Branching & releases

The mirror is written at each ATLAS release cut and never gates a release. The docs pages ship
with the web app, like any other page.
Same branch model and Conventional Commits (`../docs/ATLAS_Development_Conventions.md`).
After cloning: `git config core.hooksPath .githooks`

## Ownership & help

Isuru Harischandra. This repo is public — see `CLAUDE.md` before writing anything.
