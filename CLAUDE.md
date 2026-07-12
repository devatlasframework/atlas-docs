# atlas-docs — house rules

**PUBLIC** developer documentation for the ATLAS API + the published OpenAPI description.
Audience: third-party developers.

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
