# atlas-docs

**Public** developer documentation for the ATLAS API, plus the published OpenAPI description.
Audience: third-party developers building on "the personalisation layer for e-learning".
Served as the `/docs` site (UI map P10/D8).

## Layout

| Path | What |
|---|---|
| `api/` | The published OpenAPI description (mirrored from `atlas` → `packages/api-spec` at release) |
| `guides/` | Quickstart, auth, webhooks, pagination, errors — prose guides |
| `changelog/` | API changelog, one entry per released change |

## Prerequisites

> Docs-site toolchain TBD (static site generator chosen when the site is built).

## How to run it locally / tests

> Placeholder until the site toolchain lands: markdown lint + link check in CI.

## Branching & releases

Docs are edited and published independently of app deployments; they never gate a release.
Same branch model and Conventional Commits (`../docs/ATLAS_Development_Conventions.md`).
After cloning: `git config core.hooksPath .githooks`

## Ownership & help

Isuru Harischandra. This repo is public — see `CLAUDE.md` before writing anything.
