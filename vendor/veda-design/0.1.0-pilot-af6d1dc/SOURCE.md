# VEDA AI shared design assets (pilot snapshot)

These files are an unmodified copy of runtime assets from the VEDA AI shared
design system. They are vendored here so the search page works without any
CDN, private URL, submodule, or build step.

| Item | Value |
| --- | --- |
| Upstream repository | `Yuzki/veda-ai-design-system` (private at the time of copying) |
| Upstream version | 0.1.0, **unreleased**: no tag or release exists |
| Pinned commit | `af6d1dc9f565b9d9a561a6479fef11131c75e3e4` (merge of upstream PR #13, issue #12) |
| Designation | Pilot snapshot adding shared display preferences (language and color theme shared across veda-ai.org subdomains). Not an approved release. |
| Copied on | 2026-10-19 |

## Copied files

Copied byte for byte from the pinned commit (`gh api` raw contents at that
ref); each digest was compared with the raw upstream bytes at the pinned commit.

| Path | SHA-256 |
| --- | --- |
| `styles/tokens.css` | `96117f3d1cbc4d50da99b433be7225dbec3820f745c52c3769f59d2659fede86` |
| `styles/typography.css` | `746846c45bd692f669ea5d84c06524c4e8a83cb887d1f0621acc245844e7ec50` |
| `styles/components.css` | `fb3addbeb2a68104fab4e59ca5862cbf7998951e3b4850a77a042fbcc3a92000` |
| `scripts/i18n.js` | `ec76b7eb940926d1d344efe5b9324c675fbf1b0d1cf977f5dfc57ae1953277d6` |
| `scripts/theme.js` | `c5fb1d7093b10f52c4b13250fde39cd56390035973d8f3f060353a931e962db9` |
| `scripts/settings.js` | `9b971ed13b198bfc2f8f9f5fb42df59ac3d0d21dcec1c5c06a0f0366260569a7` |
| `scripts/report.js` | `071b65faf7399893061699706585def21e86a477f182c39b7610e7c6dd49b982` |

Compared with the previous snapshot (`cad0076`), `scripts/i18n.js`,
`scripts/theme.js` and `scripts/settings.js` changed (shared language and theme
resolution, shared cookie, URL parameters). The CSS files and `report.js` are
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
- **Rollback:** revert the commit that switched `index.html` to this snapshot.
  The previous snapshot `vendor/veda-design/0.1.0-pilot-cad0076/` is kept and
  works with the previous markup.
