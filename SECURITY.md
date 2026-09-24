# Security Policy

`atlas-docs` holds the public developer documentation for the ATLAS API and the published OpenAPI
description. It ships no running code — but documentation has a real security surface: if a guide
teaches an unsafe pattern, or the OpenAPI description misstates how authentication or scopes work,
every integration built from it inherits that mistake. We treat those as security bugs, not typos.

This repository is also a **public reporting entry point for the whole ATLAS platform**. Most ATLAS
repositories are private, so if you have found a security issue anywhere in ATLAS — the API, the web
app, the document pipeline, the infrastructure, the SDKs — report it here and we will route it
internally. Please do not go looking for somewhere better to file it.

---

## Supported Versions

Documentation is **continuously published** and is not versioned in releases of its own. Only the
current published site and the OpenAPI description on `main` are supported.

| Version                        | Supported          | Notes                                                      |
| ------------------------------ | ------------------ | ---------------------------------------------------------- |
| Published docs site (`main`)   | :white_check_mark: | The live documentation                                     |
| `develop`                      | :white_check_mark: | Staged content — report anything you find here too         |
| Archived or cached older pages | :x:                | Snapshots and third-party mirrors are not maintained by us |

The **OpenAPI description** in `api/` is copied from the platform's own `packages/api-spec` when a
release is cut, and [`api/MIRROR.md`](api/MIRROR.md) names which contract version it is. On `main` it
describes the API currently in Production. On `develop` it can describe a contract that is in
testing and has **not reached Production yet**. Report anything you find in either. Documented API versions follow
the platform's own deprecation policy; documentation for a retired API version is removed rather
than maintained.

---

## Reporting a Vulnerability

**Do not open a public issue, discussion, or pull request for a security problem**, and please do
not post about it publicly before it is fixed and disclosed.

Use GitHub's private reporting:

**[Report a vulnerability](https://github.com/devatlasframework/atlas-docs/security/advisories/new)**
&nbsp;— or the _Security_ tab → _Advisories_ → _Report a vulnerability_

Your report is visible only to you and the maintainers.

### What to include

- **What is wrong, and what it leads to** — for a documentation issue, the unsafe outcome a reader
  would arrive at by following it.
- **The exact page, section, or OpenAPI path/operation**, and a permalink if you have one.
- **What the correct behaviour is**, if you know it — particularly where the docs and the real API
  disagree.
- For anything in the running service: reproduction steps and a minimal proof of concept.

### What happens next

| Stage                  | Target                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Acknowledgement**    | Within **5 business days**                                                            |
| **Triage + severity**  | Within **10 business days**                                                           |
| **Fix published**      | Per severity (below) — documentation corrections usually ship the same week           |
| **Advisory published** | Within **10 business days of the fix**, crediting you, where an advisory is warranted |

Documentation corrections are usually published directly and quickly, without an advisory. If a
misleading document has caused integrators to build something insecure, we will publish a notice in
`changelog/` as well, so people who already followed it find out.

> **On capacity, so expectations are honest:** ATLAS is built and maintained by a single developer as
> part of an MSc research project. There is no 24/7 rotation and **no bug bounty** — we cannot offer
> payment. What we offer is a real fix, a straight answer, and public credit.

### Severity

We score with **CVSS v3.1**, with one ATLAS-specific escalation: **anything that crosses an
organisation boundary or exposes another tenant's data is at least High**, regardless of base score.
Tenant isolation is the platform's first non-negotiable.

| Severity     | Examples                                                                                                                 | Fix target   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------ |
| **Critical** | A live credential committed to this repository or an example · a documented flow that exposes another tenant's data      | **14 days**  |
| **High**     | The OpenAPI description misstating authentication, scopes, or permissions such that integrations are built insecurely    | **30 days**  |
| **Medium**   | A guide or sample that teaches an unsafe pattern — a key in client-side code, TLS verification disabled, tokens in a URL | **90 days**  |
| **Low**      | Minor inaccuracy with a limited, demonstrable security consequence                                                       | Next publish |

---

## Scope

### In scope

| Area                             | What we want to hear about                                                                                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unsafe guidance**              | Any guide, quickstart, or sample that teaches an insecure pattern — API keys in browser code, credentials in URLs or query strings, TLS verification disabled, secrets in examples that look copy-pasteable |
| **Incorrect security semantics** | The OpenAPI description or a guide misstating authentication, scopes, roles, rate limits, or tenancy rules — anywhere the docs promise a guarantee the API does not make                                    |
| **Leaked material**              | A real credential, token, internal hostname, or private endpoint committed here or embedded in an example, in the tree or in git history                                                                    |
| **Docs site** (once built)       | XSS or content injection in the published site · a supply-chain issue in the site toolchain · a vulnerable dependency with a reachable path                                                                 |
| **Links and integrity**          | A link, redirect, or embedded asset pointing to a domain we do not control, or to a package that is not ours                                                                                                |
| **The ATLAS platform itself**    | Anything in the hosted service — cross-tenant access, IDOR, authentication or MFA bypass, prompt injection, privacy leaks. Report it here and we will route it                                              |

**Found a live credential?** Report it immediately and treat it as Critical, even if it looks
expired or low-value. Do not use it, do not test its scope, and do not paste the whole secret into
your report — the first few characters and its location are enough for us to identify and rotate it.

### Out of scope

- **Ordinary documentation bugs** — typos, broken links, stale screenshots, unclear prose. Those are
  very welcome as normal issues or pull requests; they just are not security reports.
- **Reports with no proof of concept**, or raw scanner or AI-tool output.
- **Dependency CVEs with no reachable path** in the published site. Show the path and it is in scope.
- Findings that apply only to our non-Production environments, which are internal, hold no real user
  data, and are not hardened to Production standards.
- Missing security headers on pages with no sensitive action and no demonstrated impact — the docs
  site is static and holds no user data or session.
- Email spoofing on domains that send no mail, without a working phishing proof of concept.
- Copyright and abuse complaints about content hosted on the platform — those go through the
  takedown process described in the API documentation, not through this policy.
- Social engineering, phishing, or physical attacks against the maintainer or any third party.

---

## Testing Rules and Safe Harbour

If a finding requires exercising the API rather than reading the docs, test against **your own**
ATLAS organisation. When testing, you must not:

- Access, modify, download, or retain data belonging to anyone but yourself. **If you achieve access
  to another organisation's data, stop immediately** — do not enumerate and do not pivot. One record
  proving it is exactly the right amount of evidence.
- Run automated scanners, fuzzers, or credential-stuffing tools against the hosted service or the
  docs site.
- Perform denial-of-service, load, or stress testing.
- Use a credential you discovered, or attempt to widen access with it.
- Social-engineer, phish, or physically target any person.

**Safe harbour.** If you make a good-faith effort to follow this policy, we will treat your research
as authorised, will not pursue legal action or ask a platform to act against you, and will work with
you to fix the issue quickly. If a third party brings action over research that followed this policy,
we will make that authorisation clear.

---

## Disclosure

We practise **coordinated disclosure**.

- Where an advisory is warranted, we publish it within **10 business days of the fix**, and request
  a CVE where appropriate.
- Our default embargo is **90 days from acknowledgement**. If we need longer, we will tell you why
  and agree a new date with you rather than let it lapse silently.
- If an issue is being actively exploited, we fix and disclose as fast as we can.
- **You will be credited by name or handle** unless you ask us not to.
- Please do not publish before the fix or advisory goes out. If you have a hard publication
  deadline, say so in your first message and we will work to it.

---

## Building on ATLAS Safely

The security expectations we place on integrators — not vulnerabilities, just the things that most
often go wrong:

- **API keys are server-side credentials.** Never put one in browser JavaScript, a mobile binary, or
  any artefact a user can read.
- **Never put a credential in a URL** — query strings end up in browser history, proxy logs, server
  access logs, and `Referer` headers. Use the `Authorization` header.
- **You are the data controller for your own learners.** Consent, retention, and deletion for the
  data you send us are your responsibility.
- **Verify webhook signatures** before acting on a webhook, and treat the payload as untrusted input.
- **Rotate a key the moment you suspect exposure**, and prefer the narrowest scope that works.

---

## Related

- **Official client SDKs:** [`atlas-sdks`](https://github.com/devatlasframework/atlas-sdks)
- **The platform itself** (private): `atlas`, `atlas-infra` — report issues in either through this
  repository's advisory link.
