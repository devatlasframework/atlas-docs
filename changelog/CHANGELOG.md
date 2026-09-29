# Changelog — the ATLAS public API contract

This is the changelog of the **contract**, not of the ATLAS product. `info.version` in
`openapi.yaml` moves only when the surface described there moves; the product has release
numbers of its own, which move at every release, and the two are allowed to disagree.
That they disagree is the point: pin to the contract's version.

ATLAS promises that `/v1` stays backwards-compatible within a version, with clear
deprecation notices and a changelog. This file is that changelog.

**Every change to either published file — the contract or this changelog — bumps
`info.version` and adds an entry here.** The build refuses a change that does neither.

Versions are SemVer: **minor** for additive, backwards-compatible change (a new operation,
a new optional field, a new enum value); **patch** for corrections that change no shape.
There is no major inside `/v1` — a breaking change means `/v2`, never an edit.

## 1.7.0 — 2026-09-26

**The delegated pass names the operation that issues it.** `delegatedPassAuth` now carries
`x-atlas-issued-by: exchangeDelegatedToken`. Until this version, the only link between the scheme
and the token exchange was a sentence in the scheme's description. The token exchange takes no
credential, like the product's own sign-in and consent operations, so nothing a tool could read
told them apart.

Nothing on the wire changed. No operation, field, header, status or code moved. It is a minor
version because it adds a value that tools read and act on: the ATLAS SDKs cover every operation
whose `security` admits an API key or a delegated pass, plus the operation a scheme names in
`x-atlas-issued-by`, and they read that set from this file rather than from a list anyone keeps.

### What you need to do

- **Nothing, unless you generate a client.** If you do, the extension tells your generator where a
  pass comes from. It names an operation for your server to call, never a flow for a tool to run.

## 1.6.0 — 2026-09-25

Written for you. This version rewrites the contract for a reader outside ATLAS and makes every
refusal carry a code. It also declares the rate-limit refusals the API always could send. No
operation was added or removed and no success response changed shape. Where the wire changed, a
refusal that used to answer without a code, or with a `500`, now answers a `400` with one.

It is a minor version for two reasons. It adds error codes, which are new values you can branch
on, the same as a new enum value. And it declares responses that were already possible but never
described.

**The descriptions cite nothing you cannot open.** About 640 descriptions pointed at documents
outside this contract: private tickets, design records, section numbers of internal plans, and
screen and step identifiers. Each now states the rule it was citing. The file carries no YAML
comments, and this changelog has had the same rewrite. If you generated anything from `1.5.0`,
the docstrings change; nothing else about those operations does.

**Every refusal carries an `errorCode`, and that is what to branch on.** `Problem` now says so,
and the API description names the one exception: a path with an encoded slash or a NUL byte,
which the web server refuses before this API sees it.
`type` is an identifier to compare, never a link to fetch: nothing is published at those
addresses yet, and `type` is coarser than the code. New codes:

- `ATLAS-VAL-002`: a body that could not be read. It is not JSON, or a value cannot take its
  field's type, such as a string where a number belongs or a name an enum does not know. It was a
  `400` with no code.
- `ATLAS-VAL-003`: a path, query or header value that could not be read, or a required one that
  is absent. It was a `400` with no code, and it quoted the value back.
- `ATLAS-DEV-020`: a profile sent to `presentForEndUser` that disagrees with the instrument. See
  below.
- `ATLAS-SYS-009`: a method the address does not answer (`405`).
- `ATLAS-SYS-010`: a `Content-Type` or `Accept` an operation cannot serve (`415`/`406`).
- `ATLAS-FRM-010` and `ATLAS-FRM-011`: the discussion live link's connection cap (`429`, no
  `Retry-After`) and a token too close to expiry to open one on (`503`). Both answered with no
  code before; the connection cap was already described as told apart by its code.
- An address nothing answers at is now `404` with `ATLAS-SYS-005`, and a query parameter over its
  stated bound is `400` with `ATLAS-VAL-001`, the same code a body field gets.

The API already sent thirteen codes that this contract never named. They are now documented on
the operations that raise them:

- verification and password-reset links: `ATLAS-AUTH-002`, `-003`, `-008`, `-009`;
- the resend cooldown: `ATLAS-AUTH-004`;
- a session that could not be started because the account changed mid-sign-in: `ATLAS-AUTH-023`;
- a stored upload that is not the one expected: `ATLAS-CNT-009`;
- the storage allowance: `ATLAS-CNT-025`;
- a highlighted range that does not match its block: `ATLAS-CNT-021`;
- note export: `ATLAS-CNT-022`, `-023`;
- quiet hours: `ATLAS-NOTIF-001`;
- an already-registered email: `ATLAS-AUTH-001`.

Errors arrays name fields the same way everywhere: properties dotted, map keys and indices in
brackets. No refusal repeats a value you sent in a body or a query; a problem's `instance`
is the request's own path.

**Every operation a request-rate limit can refuse now declares its `429`.** That is 133 more
operations. They include `listResources`, `getResource` and `getResourceDownload`, which an API
key reaches. The authenticated ones share one description, `Throttled`, which carries
`Retry-After` and the three `RateLimit-*` headers. `RateLimit-Remaining` reads zero on it
whichever budget refused, yours or your organisation's. The AI-allowance read still never
answers `429`, by design.

**`presentForEndUser` holds the profile you send to the instrument.** A profile that disagrees
used to reach the engine. A sub-dimension or category the instrument does not have, the wrong
shape for a code, a missing score or a score off the 1-5 scale was a `500`. The multi-category
shape under a bipolar code with both poles present was a `200` that endorsed both opposite
poles. Each is now a `400`: `ATLAS-DEV-020` names every field that disagrees, and never the
value. The profile's maps and lists carry size bounds (`ATLAS-VAL-001`), and `BipolarScore.score`
and each category score declare `1`-`5`.

**The delegated pass is declared as a bearer token, `delegatedPassAuth`, not as an OAuth flow.**
The `oauth2` scheme named hosts that do not exist and a form-encoded token leg that the token
endpoint refuses. Documentation tools and generated clients act on a declared flow, so it could
not be used as written. The pass itself, the header, the three operations that accept it and
the `content:read` permission are unchanged. The scheme's description now says how to obtain a
pass, and this contract names no host at all.

**Tags are one declared set.** There is a top-level `tags:` array with a description for each of
17 tags. Three tags were renamed: `Reader` → `reader`, `Discussions` → `discussions`,
`Peer review` → `peer-review`. Seventeen operations that carried no tag now carry `reader` (the
tutor) or the new `progress` (progress, mastery, recommendations, goals and study reminders). A
client generated per tag gets different class names for those groups.

### What you need to do

- **Branch on `errorCode`.** If you branched on the problem `type`, or on a status alone, move to
  the code.
- **If your auth configuration names the delegated scheme**, it is now `delegatedPassAuth`. The
  credential and the header are the same.
- **If you generate a client**, regenerate it. The tag renames and the new `429` declarations
  change what is generated. The wire does not change.

## 1.5.0 — 2026-09-22

Webhooks. ATLAS can now call **you** when something happens, which is the first
thing in this contract that describes a request ATLAS makes rather than one you make.
It lives in a new top-level `webhooks:` section — if your tooling has been ignoring
that key because it was empty, it is not empty any more. No operation was removed, no
field changed shape, and no existing response body changed.

Four things are worth reading before you build against it.

**Delivery is at-least-once, and an earlier description of it said otherwise.** That
description promised _"retry later (no duplicates)"_, and this release corrects it in
public rather than leaving you to discover it. ATLAS retries a delivery whose outcome
it did not observe, and a process that died after your server answered is
indistinguishable from one that died before it did. Every message carries a
`delivery_id` that is **byte-identical across every retry and every replay**, inside
the bytes the signature covers. Record it, ignore what you have seen, and duplicates
cost you nothing. The attempt number travels as a header, outside the signature, and
is for your logs rather than for your decisions.

**Signatures are `t=…,v1=…` over `timestamp + "." + body`, and there can be more than
one `v1`.** The full recipe is on the `ResourceWebhookEvent` schema, including the two
things that are easy to get wrong: verify against the raw bytes before parsing, and
check the freshness of the `t` that produced your match rather than the last one you
parsed. During a secret rotation ATLAS sends two `v1` values, so try each until one
matches — a verifier that checks only the first will reject about half of what arrives
during the overlap.

**Your endpoint must be reachable at a public `https` address, and that is checked
every time, not once.** ATLAS resolves the host at send and refuses to call it if any
resolved address is loopback, link-local, private, unique-local or carrier-grade NAT;
redirects are never followed. A name that resolves publicly today and privately
tomorrow is refused tomorrow. There is no setting that relaxes this, including in
development — use a public tunnel rather than `localhost`.

**Every webhook operation is for a signed-in person, and `webhooks:manage` stays
reserved.** An API key reaches none of them. Changing the address ATLAS dials and
reading back what answered are, together, a port scanner pointed wherever the caller
likes — so withholding only the synchronous test button, which was the first design,
would have been a distinction with no security content. A key may sit in a CI job or a
leaked `.env`; a person pressing a button on a screen may not. Making that scope live
needs a narrower vocabulary than "manage", which is a change to the permission
vocabulary rather than a filter edit.

Three operations return a signing secret — registration, rotation and an explicit
reveal — and unlike an API key, a webhook secret is stored encrypted rather than
hashed, because the webhooks screen shows it beside the address. Rotating twice inside
the overlap window is refused rather than silently cutting off a receiver that has not
redeployed yet.

`testWebhookEndpoint` carries a **second budget of its own**, separate from the
general request budget: a small per-organisation allowance, refused with `429` and
`ATLAS-DEV-019`. It is the only operation in ATLAS that dials an address you chose and
hands back the outcome synchronously, so unmetered it is a port scanner with a
read-back channel. Like every other rate-limited refusal here it carries `Retry-After`
— which it did not, in the first cut of this release, until the gate added at 1.1.0
caught the one new operation that had written its own `429` rather than reusing the
shared response. Worth noting that 1.1.0's sweep was the milder case: there _"the
header was already being sent; only the contract was silent"_. Here neither said it.

Added: `listWebhookEndpoints`, `createWebhookEndpoint`, `updateWebhookEndpoint`,
`deleteWebhookEndpoint`, `revealWebhookSecret`, `rotateWebhookSecret`,
`testWebhookEndpoint`, `listWebhookDeliveries`, `replayWebhookDelivery`; the
`webhooks:` entries `resource.ready`, `resource.updated` and `resource.failed`; and
the error codes `ATLAS-DEV-015` through `ATLAS-DEV-019`.

## 1.4.0 — 2026-09-18

Sign-in on behalf. An application can now act **as one of your users**, with that
person's permission, limited to what they approved on a screen ATLAS showed them.
This is the third way to reach `/v1` — alongside a signed-in session and an API key
— and it is the first one where the data reached belongs to a person rather than to
an organisation. No operation was removed, no field changed shape, and no existing
response body changed.

Three things are worth reading before you build against it.

**A pass is scoped to one organisation.** Your authorization request names it, the
consent screen shows the person which one, and the pass is refused on every other —
including other organisations that same person belongs to. Most ATLAS users belong
to several, so this is a decision you make per request rather than a detail.

**The token endpoint takes JSON, not `application/x-www-form-urlencoded`.** This
departs from RFC 6749 deliberately: every other operation in this contract is plain
JSON and client libraries are generated from one document, so a single form-encoded
endpoint would be the only one of its kind. The practical
consequence is that an off-the-shelf OAuth2 client library will not work against
this leg unmodified. The response field names _are_ RFC 6749's — `access_token`,
`token_type`, `expires_in`, `refresh_token`.

**A withdrawal takes effect immediately.** ATLAS re-reads the grant on every
delegated call, so when somebody disconnects your application in their settings the
next request you make is refused. There is no window to wait out, and no
notification — handle a `401` by sending the person through the consent screen
again.

### Added

- **`POST /v1/oauth/authorization-requests`** — validates an authorization request
  and returns what the consent screen will show, behind an opaque handle. Takes no
  credential: a logged-out person can be sent to a consent link, so this cannot wait
  for a session. Every refusal is one `400` with `ATLAS-DEV-013` — an unknown client
  id, an unregistered address, an undeclared scope and a malformed challenge are
  indistinguishable, because a refusal that told them apart would be an oracle for
  which applications exist and which addresses they have registered.
- **`GET /v1/oauth/authorization-requests/{requestId}`** — reads that request back
  for the screen, under the person's own session. This is where their membership of
  the named organisation is checked; a non-member gets a `404`, the same answer an
  organisation that does not exist gets.
- **`POST /v1/oauth/authorization-requests/{requestId}/decision`** — Allow or Deny.
  Consumes the request, so two tabs cannot both produce a grant. On Deny nothing is
  created and you are still told, at your registered address, with
  `error=access_denied`.
- **`POST /v1/oauth/token`** — exchanges the one-time code for a pass, or renews one.
  No credential and **no client secret**: PKCE binds the exchange instead, which is
  what lets native and browser clients use this flow without shipping a secret that
  is not a secret. Every refusal is one `400` with `ATLAS-DEV-014`.
- **`GET`/`DELETE /v1/oauth/grants[/{grantId}]`** — the person's own connected
  applications and the withdrawal. Not reachable with an API key or with a delegated
  pass: which third parties somebody has authorised is theirs to read, not yours.
- **The `oauth2` security scheme**, with the `authorizationCode` flow. It publishes
  exactly the scopes a delegated pass can be granted — today `content:read` — rather
  than the whole vocabulary, so a scope offered in the flow is one you can actually
  get.
- **`redirectUris` on applications** (`CreateAppRequest`, `UpdateAppRequest`,
  `AppResponse`). **Matched as an exact registered literal** — never by prefix, never
  by host, never by pattern — so register every address you will use, spelled exactly
  as you will send it, including the scheme, any port and any trailing slash.
  `https://` only, except on `localhost` and `127.0.0.1`. Replaced whole, never
  merged; an application with none cannot be used for sign-in on behalf at all.

### Notes for existing callers

Nothing changes for you. API keys are untouched, `apiKeyAuth` reaches exactly what it
reached before, and `redirectUris` is optional everywhere — an application that never
uses sign-in on behalf registers none and behaves as it always did.

`profiles:read` remains **reserved** and is not in the `oauth2` flow's scopes. A
learner's profile and questionnaire answers are the one category beyond every plan,
setting and role; serving them to an application a person has themselves
authorised is a coherent thing to want and is a decision not yet taken, rather than
an omission.

## 1.3.0 — 2026-09-17

Permission scopes, end users, a repeat guard, and usage. A key stops being a
credential that only describes itself: it now reads your organisation's content,
links your own learners, asks for personalisation on their behalf and reports what
your applications have used — each bounded by a scope you chose when you minted it.
No operation was removed, no field changed shape, and no existing response body
changed. Keys issued before this release carry no scopes and therefore reach
exactly what they reached before: their own identity, and nothing else.

### Added

- **Permission scopes**, published on the `apiKeyAuth` scheme as
  `x-atlas-scopes` and named per operation. Eight names ship, four of them
  reserved and reaching nothing yet — reserved rather than omitted, because a name
  that appears later is a new version of the vocabulary, while a name that exists
  and reaches nothing is a promise you can check us against. There is no scope
  meaning "everything", no hierarchy and no implication: `content:write` does not
  grant `content:read`. An operation that names no scope is one no key reaches.
- **`scopes` on applications and keys.** An application declares the set its keys
  may be minted with; a key carries a subset, chosen at creation. Asking for a
  scope the application does not declare is refused (`400`, `ATLAS-DEV-008`) rather
  than quietly narrowed — a key weaker than the one you asked for fails later, in
  production, on a call you believed was permitted. A key's set is **fixed once
  minted**: widening is a new key, narrowing is a revoke, and a rotation carries
  the set forward unchanged so rotating a leaked key can never grant it more than
  it had. Changing an application's set never disarms keys already issued under it.
- **Content reads over a key** — `GET /o/{orgId}/resources`, `…/{resourceId}` and
  `…/{resourceId}/download`, under `content:read`. A key reads its own developer
  account; naming another organisation is refused byte-for-byte identically to
  naming one that does not exist, so the refusal cannot be used to find out which.
- **End users** — `GET`/`POST /o/{orgId}/end-users` and
  `DELETE /o/{orgId}/end-users/{endUserId}`, under `end-users:manage`. You are the
  data controller for these people and ATLAS is your processor, so ATLAS holds a
  **SHA-256 digest** of your own reference for them and nothing else: no name, no
  email, no profile. There is no field on any response that could return the
  reference, and no request that retrieves it. Linking an already-linked learner
  returns the existing link rather than refusing. Revoking keeps the row, because
  billing on active end users has to stay answerable for a period that has closed.
- **Personalisation for an end user** —
  `POST /o/{orgId}/end-users/{endUserId}/present`, under `ai:use`. You send the
  learner's profile with the request, every time: ATLAS stores no profile for an
  end user, so there is no cached copy to go stale and a retake on your side is
  instant by construction. This is the instant-changes half — the features ATLAS
  recommends and the presentation plan — and it spends no AI allowance. Revoking
  the link refuses it immediately.
- **An `Idempotency-Key` header** on `POST /o/{orgId}/end-users`, a repeat
  guard. Optional. The same key with the same body replays the first
  outcome; the same key with a **different** body is refused `409` rather than
  answered with somebody else's result, because a repeat guard promises a retry
  does not act twice and promises nothing about one key meaning two things.
- **Usage** — `GET /o/{orgId}/dev/usage`, under `usage:read`, with calls, a
  per-app breakdown and your standing against the request budget. Reading it does
  not spend it. `rateLimit` is **absent** when the counter could not be read:
  absent means unknown, never "within limits".
- **`GET /o/{orgId}/dev/usage/credits`** — tokens, allowance and money.
  **Admin-only, and no API key reaches it**, because no scope in this vocabulary
  names a commercial figure. A leaked key cannot read what your account is
  spending.

### Changed

- `CreateApiKeyRequest` no longer says scopes are ignored. They are accepted and
  enforced. An IP allowlist is still planned and still absent.

### Error codes

- `ATLAS-SYS-007` — a key reached an operation whose scope it does not hold. The
  body names the scope required (it is on this contract already, so naming it
  discloses nothing) and never names what the key does hold.
- `ATLAS-SYS-008` — the key's developer account is not entitled to be served.
- `ATLAS-DEV-008` — a key was asked for with a scope its application does not
  declare.
- `ATLAS-DEV-009` / `ATLAS-DEV-010` — a malformed `Idempotency-Key`, and one
  reused for a different request.
- `ATLAS-DEV-011` — an unusable end-user reference.

## 1.2.0 — 2026-09-16

Developer accounts, applications and API keys. A second way to authenticate arrives with this
release — an API key, sent as `Authorization: Bearer atl_sk_live_…` — together with the
endpoints that create and manage one. **A key currently reaches exactly one endpoint,
`GET /key`, which describes the key itself.** Everything else in this contract is still reached with
a signed-in user's access token; key access to it, and the permission scopes that will bound
it, arrive in a later release. No operation was removed, no field changed shape, and no
existing response body changed.

### Added

- **A second security scheme, `apiKeyAuth`**, and one operation that accepts it. An operation
  accepts an API key only if it says so; everything else refuses one with `403`, identically
  for the key's own account and any other, so the refusal cannot be used to probe what exists.
  Presenting no credential at all still gives the usual `401`.
- **`GET /key`** — who the presented key is: which key, which application, which developer
  account, and when it stops working. It returns nothing the caller did not already hold, so a
  stolen key is not also a way to learn about the account it came from. Rate-limit state is on
  the response headers, where every other endpoint publishes it.
- **`POST /orgs/developer`** — create a developer account. It is an organisation like any
  other: the same three roles, invitable, with member management and seat limits. What it adds
  is the applications-and-keys surface below. A separate path rather than a field on the
  request body, because the organisation type is never something a client sends.
- **Applications** — `GET`/`POST /o/{orgId}/dev/apps`, `GET`/`PATCH
/o/{orgId}/dev/apps/{appId}`. An application groups the keys one integration calls with.
  Reading is open to all three roles; creating and changing require Admin or Moderator.
  Archiving an application keeps its keys readable and stops new ones being minted — it is not
  a delete, and it can be undone.
- **API keys** — `GET`/`POST /o/{orgId}/dev/apps/{appId}/keys`, plus `…/{keyId}/rotate` and
  `…/{keyId}/revoke`. Creating or rotating a key returns its secret **once**, in a response
  shape that exists for nothing else; the listing shape has no field a secret could occupy, and
  nothing ever returns one a second time. Store it when you receive it, and rotate if you lose
  it.
- **`DEVELOPER` as a third organisation type** on the three schemas that carry one. Existing
  clients that switch on `PRIVATE`/`SHARED` should treat an unknown value the way they would
  treat `SHARED`.

### Two things to know before building against keys

- **A key is a server-side secret.** ATLAS answers no cross-origin request, so a key a browser
  can send has already been exposed. Keep one on your own server.
- **Rotation and revocation behave differently on purpose.** Rotating mints a successor and
  leaves the old key working for a short overlap, so a deploy can cross over; the successor
  inherits the old key's expiry, because a rotation replaces a secret and not a lifetime.
  Revoking takes effect on the very next call, with no window at all — key checks are not
  cached. If a key has leaked, rotate **and** revoke.

## 1.1.0 — 2026-09-16

Response headers. The API has always sent `Retry-After` with a rate-limited refusal; it now
also sends a request id on every response and rate-limit counters on the authenticated surface,
and this file describes all of them. No operation was removed, no field changed shape, and no
existing response body changed.

### Added

- **`X-Request-Id` on every response**, success or failure — a fresh value per request, minted
  by ATLAS and never read from the request, matching the server-side record of the same call.
  Until now the only correlator a caller could quote was the `errorId` in a `500` body, so a
  report about a `403`, a `409` or a `429` had nothing to identify the call by. Described in
  the API description rather than on each operation: it is a property of the whole surface.
- **`RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset`** on every authenticated
  response outside `/auth/*`, describing the caller's own request budget. Declared as reusable
  header components and referenced from the `429` responses of the operations that carry them;
  the rule for successful responses is in the API description, since OpenAPI cannot state a
  header that applies to every operation. Their **absence means unknown, not unlimited** — if
  the counter cannot be reached the request is served and the headers are omitted rather than
  carrying a figure the server cannot stand behind.
- **`429` on five operations that could always return one and did not declare it**: opening a
  discussion thread, replying to one, publishing to the achievements board, leaving it, and
  downloading an invoice PDF. Each already had a budget behind it; a caller reading the
  contract had no way to know.
- **`Retry-After` documented on the 20 operations that declared a `429` without it.** The
  header was already being sent; only the contract was silent.

### Changed

- `/auth/resend-verification` now references the shared `Retry-After` header component instead
  of restating it inline. Same header, same meaning.
- The shared rate-limited response now says that on the **sign-in** endpoints it carries
  `Retry-After` and **no** rate-limit counters — a remaining count there would distinguish a
  refused request budget from a locked account, which those responses are deliberately shaped to
  keep indistinguishable — while authenticated operations answering with the same shape do carry
  the counters. Three authenticated operations that used it (asking the discussion facilitator,
  opening a poll, casting a ballot) now declare their own `429` with all four headers, because
  they do carry them.

### Two things to know before branching on these headers

- **`RateLimit-Remaining` does not read zero on every refusal.** Several operations have their
  own narrower limits; when one of those refuses, the caller's overall figures are carried
  through unchanged, so the header can read a healthy number beside a `429`. Diagnose a refusal
  from `Retry-After` and the `errorCode`, never from `RateLimit-Remaining`.
- **Not every `429` carries `Retry-After`.** Two kinds carry no wait, because neither clears
  after an interval: an exhausted AI credit allowance, which resets daily, and the discussion
  live-link connection cap, which clears when a connection is closed.

## 1.0.1 — 2026-09-15

Corrections to `1.0.0`, found in review. No operation was added or removed and no field
changed shape.

### Fixed

- **`DiscussionLivePoke.kind` refused the value its own description says to expect.** It
  declared `type: [string, 'null']` beside `enum: [POST, POLL, FACILITATOR]`, and in JSON
  Schema 2020-12 `enum` constrains the instance independently of `type` — so a frame with
  `kind: null` failed validation while the description said _"Read a null `kind` as
  `POST`"_. `null` is now a member, matching the three `failureReason` enums.
- **The paging section said "two groups" when there are three.** The seven reads that cap
  with a bare `limit` and offer no second page were neither counted nor marked; they now
  carry `x-atlas-pagination: deferred-j3` like the other thirteen, so all twenty
  array-returning reads are in one countable inventory.
- **Prose that named internal classes, tests, ADRs and ticket numbers** has been replaced
  with the behaviour a caller can act on. YAML comments are stripped by generators;
  `description` values are not, and these were reaching the published docs and SDKs.
- **The "what this contract does not cover" note described the internal topology** of the
  non-public routes rather than simply stating that they are out of contract.

## 1.0.0 — 2026-09-15

The first version of the contract as a contract. Nothing in CI had read this file as a
specification before now, so this entry records corrections rather than new surface. **No
operation was added or removed and no field changed shape**, which is why this is `1.0.0`
and not `2.0.0`: a client generated from the previous file still compiles and still works.

### Added

- `500` responses on **all 178 operations**, referencing a new
  `components/responses/InternalError`. The API could answer one from any route, stamping
  `ATLAS-SYS-001` and an `errorId`, and not one operation declared it — so the one response
  shape every operation shares was untypable by a generated client, and the promise of
  clear errors with a request id was one nobody could keep.
- `401` and `404` on five org-scoped peer-review reads that declared only a `200`
  (`/o/{orgId}/review/rubric`, `/queue`, `/submissions/mine`, `/reviews/mine`,
  `/reviews/of-my-work`). They have always answered both.
- `400` on `POST /notifications/unsubscribe` and
  `GET /billing/checkout/{orgId}/{redirectToken}/start`, the only refusals either has —
  both about a malformed request, never about the link or the token, which stay
  deliberately indistinguishable so neither endpoint becomes an existence oracle.
- `info.license` (MIT), matching what `atlas-sdks` and `atlas-docs` already carry.
- `components/schemas/EmailPreferenceKey`, promoted from an inline parameter enum.
- `contentSchema` on the two SSE responses, naming the payload their prose already
  described (`TutorAnswer`, `DiscussionLivePoke` — both previously referenced by nothing).
- **The paging convention, stated in `info.description`** — a bounded `limit`, an opaque
  `cursor`, and a `{items, nextCursor}` envelope. It is named in the published
  description rather than in a YAML comment because generators strip comments: a
  convention written only in comments is one nobody outside this repository can read. The
  four `page`+`size` operations are frozen, and the thirteen unbounded array reads carry
  `x-atlas-pagination: deferred-j3`.

### Fixed

- **`ATLAS-PRS-002` did not exist.** `POST /o/{orgId}/resources/{resourceId}/search`'s 409
  documented it; the api throws `ATLAS-PER-002`. `PRS` is not one of the 14 module prefixes
  the product declares, so a client branching on it could never match.
- **`ATLAS-AUTH-014` on 20 org-scoped 401s → `ATLAS-SYS-002`.** `ATLAS-AUTH-014` is the
  Google sign-in code and belongs to exactly one operation, which keeps it. Every other 401
  in this API comes from one entry point, which stamps `ATLAS-SYS-002`.
- **`ATLAS-ORG-003` on 7 descriptions → `ATLAS-ORG-002`.** `ORG-003` is "member, wrong
  role"; non-membership is `ORG-002`. The other 43 occurrences of `ORG-003` were correct
  and are byte-identical.
- **`study-reminder` added to the unsubscribe `k` enum.** The api was already sending that
  mail; a client validating against this enum would have rejected a valid
  unsubscribe link.
- **`POST /invitations/preview` is `security: []`.** It has always been reachable without a
  token — the invitee is logged out by construction and the token in the body is the
  authorisation — but it inherited the global `bearerAuth` and documented no 401, so a
  generated SDK would refuse to call it without credentials the caller cannot have.

### Changed

- **`info.version` no longer tracks the product.** It read `0.3.0-SNAPSHOT`; it now starts
  its own SemVer line at `1.0.0`.
- **89 fields converted from OpenAPI 3.0's `nullable: true`** to the 3.1 form this document
  declares — `type: [X, 'null']`, or `oneOf: [{$ref}, {type: 'null'}]` for the eight
  one-element `allOf` wrappers, five of them money fields a flattening generator would have
  emitted as non-nullable. The generated TypeScript is byte-identical before and after, so
  this changes no client.
- The two sentences deferring the error-code sweep to a later release are removed; the
  sweep has happened.
