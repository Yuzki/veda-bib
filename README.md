# veda-bib

Abbreviations and bibliography in Vedic philology by JAIBS

## Source

- https://www.jaibs.jp/journal/submit
- https://drive.google.com/file/d/1elvoz6GjOXmcxm8IJgOsE7fCdstRtgm3/view

## Viewer

https://yuzki.github.io/veda-bib/index.html

## Search and controls

The viewer searches titles and abbreviations with case-insensitive substring
matching, preserving dataset order. Edition text is not searched. Spaces and
Unicode composition are not normalized; a blank query shows every entry.
The primary dataset contains 138 entries and the secondary dataset contains 5.

Typing updates the results immediately; the Search button or Enter runs the
same search. Switching datasets keeps the current query. Loading, result counts,
no matches, and load errors have visible status messages. Try again retries the
failed request without clearing the query. Loaded datasets are cached for the
page session, and stale responses cannot replace the selected dataset.

The interface language follows the browser language (regional tags resolve to
their base language), with English as the fallback for unsupported languages.
The language control supports English and Japanese. Source titles,
abbreviations, authors, and bibliography remain unchanged and untranslated. If
locale loading fails, the page remains usable in English. JavaScript is required
for search; without it the source links and terms remain available.

Display preferences are shared with veda-ai.org and its subdomains. Language
resolves as a valid `?lang=` URL parameter, then the shared `veda-lang` cookie,
then the older `veda-lang` localStorage value, then the browser languages, then
English. Color theme resolves the same way with `?theme=` and `veda-theme`,
falling back to the device (system) setting. Invalid values fall through to the
next source. Only explicit choices (a URL parameter or the settings controls)
are saved; detected defaults are never stored. The shared cookie is written with
`Domain=veda-ai.org; Path=/; Max-Age=31536000; SameSite=Lax; Secure` only over
HTTPS; on `github.io`, `localhost` and other hosts only localStorage and the URL
are used, so nothing is shared. Examples: `?lang=en&theme=dark` forces English
and dark; `?theme=system` returns to the device setting. Changing a setting
updates only its own URL parameter and keeps other query parameters, the hash
and history state. The shared cookie is read at the production host
`bib.veda-ai.org`; the github.io viewer above does not share it.

Language and color theme sit in a closed "Display settings" button at the end of
the header; opening it shows an overlay panel (Esc, an outside click, or tabbing
out closes it). The theme control offers device settings, light, and dark, with
saved explicit choices; the open/closed state is not saved.

Results show 50 entries per page. The count line is the only place the total
appears (for example "138 entries (of 138)"); the page controls show just the
range ("Items 1–50") with Previous/Next buttons. Typing, Enter, and a dataset change go back
to page 1 and keep the search term; a language change keeps the current page; the
previous/next buttons and the "Go to results" link under the search form move
focus to the results heading. The search scope is unchanged (titles and
abbreviations only). The page includes a skip link, labelled controls, keyboard
focus styles, and live result/status announcements.

## Shared design snapshot

This pilot follows the approved [EWAia adoption approach](https://github.com/Yuzki/ewaia-abbreviations/pull/4).
The seven shared runtime assets are copied unmodified from commit `d08f1bf` of
`Yuzki/veda-ai-design-system` (quiet UI rules, upstream PR #15), version 0.1.0
(unreleased, no tag), into `vendor/veda-design/0.1.0-pilot-d08f1bf/`. Only
`styles/components.css` differs from the previous `af6d1dc` snapshot. There are no CDN or other
external runtime requests, build steps, or package dependencies.

The footer carries a quiet parent-site reference (`common.project.partOf`,
"Part of the VEDA AI project (veda-ai.org)") linking to `https://veda-ai.org/`
in the same tab; the label is translated through `locales/`.

See [SOURCE.md](vendor/veda-design/0.1.0-pilot-d08f1bf/SOURCE.md) for provenance,
SHA-256 digests, and terms. Do not edit vendored files. Update by copying a new
pinned snapshot into a sibling directory and switching the paths in `index.html`;
keep the old directory until verified. Roll back by reverting the rollout commits
(the previous `af6d1dc`, `cad0076`, `9d65cf4` and `0b90d3c` snapshots are kept). Service-specific styles belong in
`style.css`.

The footer "Report a problem" link opens the shared GitHub issue form with
`service=Veda Bib`; `scripts/report.js` adds `page` (origin and path only, never
the query or hash). Reports become public GitHub issues, so the footer note says
that a GitHub account is required and personal information must not be entered.

## Local development and checks

Serve the repository root rather than opening the HTML as a file:

```sh
uv run --no-project python -m http.server 8000
# Or, with an existing Python installation:
python3 -m http.server 8000
```

Open `http://localhost:8000/index.html`. Relative paths also support the existing
GitHub Pages `/veda-bib/` subpath.

Run the dependency-free Node checks (Node 24 or another version with `node:test`):

```sh
node --check script.js
node --test tests/*.test.cjs
git diff --check
```

The explicit file glob is needed because Node 24 does not accept `tests/` as a
test entrypoint here. Tests compare the original predicate on both real datasets,
check edition normalization, and validate locale keys, placeholders, plural
forms, English fallbacks, static text, and profile files, plus the 50-entry
page ranges and the settings/jump/pagination markup. No Python project or
Python application code is present, so Python lint/type/test checks do not apply.

For browser verification, exercise both datasets, typing, Enter, query retention,
no matches, request failure/retry, and blocked locale requests. Also page through
all 138 primary entries, change dataset/language/theme while on a later page, and
open the settings panel (Esc returns focus to its button, and the header height
does not change). Compare English
and Japanese with light/dark themes at 320, 390, 640, and 1280 px. Check wrapping,
keyboard order, skip link, focus, reduced motion, and forced colors. Check all
seven vendored file digests against SOURCE.md after any snapshot update.

## License and data terms

This project's own code is available under the [MIT License](LICENSE). The terms
for the JAIBS bibliography data are unconfirmed; the MIT License does not apply
to that data. The vendored design snapshot has no upstream license notice at the
pinned commit. This repository's MIT License does not apply to those assets;
their terms must be confirmed by the upstream owner before publication.
