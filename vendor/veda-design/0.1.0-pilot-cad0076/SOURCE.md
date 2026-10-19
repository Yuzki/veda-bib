# VEDA AI shared design assets (pilot snapshot)

These files are an unmodified copy of runtime assets from the VEDA AI shared
design system. They are vendored here so the search page works without any
CDN, private URL, submodule, or build step.

| Item | Value |
| --- | --- |
| Upstream repository | `Yuzki/veda-ai-design-system` (private at the time of copying) |
| Upstream version | 0.1.0, **unreleased**: no tag or release exists |
| Pinned commit | `cad007687665115f8c0d8c4d19b92d4757d0d69d` (merge of upstream PR #11, issue #10) |
| Designation | Pilot snapshot adding the parent-site navigation patterns (`.veda-project-reference` footer reference). Not an approved release. |
| Copied on | 2026-10-19 |

## Copied files

Copied byte for byte from the pinned commit (`gh api` raw contents at that
ref).

| Path | SHA-256 |
| --- | --- |
| `styles/tokens.css` | `96117f3d1cbc4d50da99b433be7225dbec3820f745c52c3769f59d2659fede86` |
| `styles/typography.css` | `746846c45bd692f669ea5d84c06524c4e8a83cb887d1f0621acc245844e7ec50` |
| `styles/components.css` | `fb3addbeb2a68104fab4e59ca5862cbf7998951e3b4850a77a042fbcc3a92000` |
| `scripts/i18n.js` | `21b14301fd35499d5cc78a7f43d5b05f74b5bf46cc24591a0d2baf93a4321285` |
| `scripts/theme.js` | `339ef814bc466d82a33bbdf8814b7934cf64b1d2457a083923e95efe8bf0953f` |
| `scripts/settings.js` | `0feb48c3c782e7964dfb5d35a600933c99d6e963089875c943ca8efe4b3c7ebd` |
| `scripts/report.js` | `071b65faf7399893061699706585def21e86a477f182c39b7610e7c6dd49b982` |

Compared with the previous snapshot (`9d65cf4`), only `styles/components.css`
changed (new `.veda-project-reference` rules, plus the header parent-link
styles, which this service does not use). The other six files are
byte-identical.

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

- **Update:** copy the new pinned commit or tag into a new sibling directory,
  record its commit and digests in a new `SOURCE.md`, switch the paths in
  `index.html`, and repeat the checks in the root README. Keep the old
  directory until the new one is verified.
- **Rollback:** revert the commit that switched `index.html` and added the
  footer reference. The previous snapshot
  `vendor/veda-design/0.1.0-pilot-9d65cf4/` is kept and works with the
  previous markup.
