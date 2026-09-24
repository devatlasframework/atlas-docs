# api

The published OpenAPI description of the ATLAS `/v1` API, in [`openapi.yaml`](openapi.yaml).
It is a byte-for-byte copy of the contract kept in the `atlas` monorepo (`packages/api-spec`),
so edit the source there, never here.

## Which contract this is

[`MIRROR.md`](MIRROR.md) says which version of the contract this file is, the ATLAS release that
first published it, the source commit it was copied from, and a sha256 of each mirrored file. This
repository's `verify-mirror` check fails if either file stops matching its checksum.

**The contract has its own version, and it is not the product's.** `info.version` follows SemVer
and moves only when the described surface moves: minor for additive change, patch for a correction
that changes no shape, and never a major inside `/v1`, because a breaking change means `/v2`. An
ATLAS release that changes nothing in the API publishes nothing here. What moved between two
versions is in [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md). Pin to this number, not
to an ATLAS release number.

## How it gets here

At each ATLAS release cut, the contract is copied from the release branch, but only after that
branch's own contract checks have passed at the exact commit being copied: a lint of the file as
OpenAPI 3.1, and tests that compare it with the running application's routes, error codes, enums
and response fields. The copy lands on this repository's `develop` branch when the release goes to
testing, and reaches `main` when that release reaches Production. So **`main` describes the API in
Production**, and `develop` may describe one that has not arrived there yet.

## Reading it

Descriptions sometimes cite `ADR-…`, `ATLAS-…` or `#…` numbers. Those point to the platform's
internal decision records and tracker, which are not public; the sentence around each one says
what the rule is. Rewording those descriptions for a public audience is planned.
