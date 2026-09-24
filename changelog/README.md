# changelog

[`CHANGELOG.md`](CHANGELOG.md) is the public API changelog: one entry for each version of the `/v1`
contract, newest first. It is mirrored from the `atlas` monorepo together with
[`../api/openapi.yaml`](../api/openapi.yaml), and the newest entry always matches that file's
`info.version`. This repository's `verify-mirror` check fails a pull request if the two
disagree, or if either file no longer matches the checksum in [`../api/MIRROR.md`](../api/MIRROR.md).

It records the **contract**, not the ATLAS product. An ATLAS release that changes nothing in the
API adds nothing here. A breaking change never appears as an entry, because it means `/v2` rather
than an edit to `/v1`.
