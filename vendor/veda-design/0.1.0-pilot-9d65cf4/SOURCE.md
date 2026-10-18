# VEDA AI shared design assets (pilot snapshot)

These files are an unmodified copy of runtime assets from the VEDA AI shared
design system. They are vendored here so the search page works without any
CDN, private URL, submodule, or build step.

| Item | Value |
| --- | --- |
| Upstream repository | `Yuzki/veda-ai-design-system` (private at the time of copying) |
| Upstream version | 0.1.0, **unreleased**: no tag or release exists |
| Pinned commit | `9d65cf437a8ed34c70647f5dce19193bbb36e323` (merge of upstream PR #9) |
| Designation | Pilot snapshot for the cross-service UX rollout (upstream issue #8): header-end display settings popover, responsive search row, results jump link, pagination styles. Not an approved release. |
| Copied on | 2026-10-19 |

## Copied files

Copied byte for byte from the pinned commit (`gh api` raw contents at that
ref).

| Path | SHA-256 |
| --- | --- |
| `styles/tokens.css` | `96117f3d1cbc4d50da99b433be7225dbec3820f745c52c3769f59d2659fede86` |
| `styles/typography.css` | `746846c45bd692f669ea5d84c06524c4e8a83cb887d1f0621acc245844e7ec50` |
| `styles/components.css` | `dbf87c5ca70c685466d689c9c3461f6f9cfc39c18b00303b913ef46578f32186` |
| `scripts/i18n.js` | `21b14301fd35499d5cc78a7f43d5b05f74b5bf46cc24591a0d2baf93a4321285` |
| `scripts/theme.js` | `339ef814bc466d82a33bbdf8814b7934cf64b1d2457a083923e95efe8bf0953f` |
| `scripts/settings.js` | `0feb48c3c782e7964dfb5d35a600933c99d6e963089875c943ca8efe4b3c7ebd` |
| `scripts/report.js` | `071b65faf7399893061699706585def21e86a477f182c39b7610e7c6dd49b982` |

Compared with the previous snapshot (`0b90d3c`), `styles/tokens.css`,
`styles/typography.css` and `scripts/report.js` are byte-identical;
`styles/components.css`, `scripts/i18n.js` and `scripts/theme.js` changed, and
`scripts/settings.js` (popover behavior) is new.

Nothing else was copied: no upstream documentation, examples, reference
catalog, upstream locale dictionaries, history, or tests. This service's own
dictionaries live in `locales/`.

To verify, run from this directory:

```sh
sha256sum styles/tokens.css styles/typography.css styles/components.css scripts/i18n.js scripts/theme.js scripts/settings.js scripts/report.js
```

## Terms

The upstream repository contained no license file or license notice at the
pinned commit. This repository's MIT License (`LICENSE`) covers this
project's own code only and is **not** applied to these files. Their terms
must be confirmed by the upstream owner before this pilot is published.

## Rules

- Do not edit these files. Service-specific styling belongs in
  `style.css`, which is loaded after them.
- Report problems in the shared assets upstream instead of patching the copy.

## Update and rollback

- **Update:** copy the new pinned commit or tag into a new sibling directory
  (for example `vendor/veda-design/0.1.1/`), record its commit and digests in
  a new `SOURCE.md`, switch the paths in `index.html`, and repeat the
  checks in the root README. Keep the old directory until the new one is
  verified.
- **Rollback:** revert the rollout commits. They restore the previous
  `index.html` markup together with the paths to
  `vendor/veda-design/0.1.0-pilot-0b90d3c/`, which is kept. Pointing the new
  markup at the old directory alone does not work (no popover styles).
