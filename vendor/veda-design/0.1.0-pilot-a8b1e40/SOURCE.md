# VEDA AI shared design assets (pilot snapshot)

These files are an unmodified copy of runtime assets from the VEDA AI shared
design system. They are vendored here so the search page works without any
CDN, private URL, submodule, or build step.

| Item | Value |
| --- | --- |
| Upstream repository | `Yuzki/veda-ai-design-system` (private at the time of copying) |
| Upstream version | 0.1.0, **unreleased**: no tag or release exists |
| Pinned commit | `a8b1e40dfa4666e0925f5fcc95abb0d9d7004bb1` (icon-only display settings, upstream PR #17) |
| Designation | Pilot snapshot adding the two icon-only display-settings entries (language, color theme). Not an approved release. |
| Copied on | 2026-10-22 |

## Copied files

Copied byte for byte from the pinned commit (`gh api` raw contents at that
ref); each digest was compared with the raw upstream bytes at the pinned commit.

| Path | SHA-256 |
| --- | --- |
| `styles/tokens.css` | `96117f3d1cbc4d50da99b433be7225dbec3820f745c52c3769f59d2659fede86` |
| `styles/typography.css` | `746846c45bd692f669ea5d84c06524c4e8a83cb887d1f0621acc245844e7ec50` |
| `styles/components.css` | `79c9449265da09a4039e95e8f3f143c281822b1d6adc4125cb3437e140fcca22` |
| `scripts/i18n.js` | `aee984c17d03d56c123ad94f2d59d90867f9714898697340be08596acddc394e` |
| `scripts/theme.js` | `37fb7483a57ca74a60f2444c2dae2a1abe9ef5cdc13cc04c5a24248adb69419f` |
| `scripts/settings.js` | `cf861ac785fcb00813cd42f5200692dc91a4c72e65f71560c1b430ee57e9cb27` |
| `scripts/report.js` | `071b65faf7399893061699706585def21e86a477f182c39b7610e7c6dd49b982` |

Compared with the previous snapshot (`d08f1bf`), `tokens.css`,
`typography.css` and `report.js` are byte-identical; the other four files
changed.

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
  The previous snapshot `vendor/veda-design/0.1.0-pilot-d08f1bf/` is kept and
  works with the previous markup.
