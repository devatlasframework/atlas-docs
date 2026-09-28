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

When an ATLAS release is cut, the contract is copied from the release branch, but only after
that branch's own contract checks have passed at the exact commit being copied: a lint of the file
as OpenAPI 3.1, and tests that compare it with the running application's routes, error codes, enums
and response fields. The copy is merged to this repository's `develop` branch once the release has
passed testing, and `develop` is merged to `main` only when that release is promoted to Production.
So `main` describes the API that Production serves, and `develop` may describe a contract that has
not reached Production yet.

## Reading it

Every description is written for you. From contract `1.6.0` on, none cites a document you cannot
open: no internal tracker or decision-record numbers, no section numbers of internal plans, and no
screen or step identifiers. Each states the rule it once cited. A check on the source refuses any
such citation before a release can be cut, so it cannot come back. The references that remain are
public: an RFC section such as `RFC 6749 §4.1.3`, and codes the API itself returns, such as the
feature-family codes `F1`–`F13` and `A1`–`A8` and the learner-profile dimension codes `D1`, `D2a` and
so on.
