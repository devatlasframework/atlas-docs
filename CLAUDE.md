# atlas-docs — house rules

**PUBLIC** developer documentation for the ATLAS API + the published OpenAPI description.
Audience: third-party developers.

What to document comes from the workspace `../docs/`: the API's design (auth, scopes, limits,
webhooks, OAuth consent, versioning) is architecture plan §11; the docs-site screens (P10/D8,
quickstart D9) are in `ATLAS_UI_Navigation_Map.md` §15; voice and brand rules are the design
guide §7 (and §2.3 for the developer slogan: "The personalisation layer for e-learning").

## Rules

- **Public repo:** never document internal or unreleased endpoints, internal hostnames, or
  operational details; no secrets in examples — placeholder keys only (`ATLAS_API_KEY`).
- Plain English, second person, active voice — the same voice as the product (Design Guide
  §7). No jargon walls; explain the first use of every term.
- Every endpoint page carries: auth requirements, copy-pasteable request/response examples
  (curl + SDK snippets), error shapes (problem details), and rate-limit behaviour.
- The OpenAPI file (`api/`) is the source of truth for reference pages; prose guides explain
  the *why* and the workflows. Never let prose contradict the spec — fix the spec first.
- Keep the changelog per released API change; breaking changes are announced clearly, never
  slipped in.
