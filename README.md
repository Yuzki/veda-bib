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

English is the default interface language. The language control supports English
and Japanese; `?lang=ja` also selects Japanese. The choice is saved when browser
storage is available. Source titles, abbreviations, authors, and bibliography
remain unchanged and untranslated. If locale loading fails, the page remains
usable in English. JavaScript is required for search; without it the source
links and terms remain available.

The theme control offers device settings, light, and dark, with saved explicit
choices. The page includes a skip link, labelled controls, keyboard focus styles,
and live result/status announcements.

## Shared design snapshot

This pilot follows the approved [EWAia adoption approach](https://github.com/Yuzki/ewaia-abbreviations/pull/4).
The five shared runtime assets are copied unmodified from commit `fbeb384` of
`Yuzki/veda-ai-design-system`, version 0.1.0 (unreleased, no tag), into
`vendor/veda-design/0.1.0-pilot-fbeb384/`. There are no CDN or other external
runtime requests, build steps, or package dependencies.

See [SOURCE.md](vendor/veda-design/0.1.0-pilot-fbeb384/SOURCE.md) for provenance,
SHA-256 digests, and terms. Do not edit vendored files. Update by copying a new
pinned snapshot into a sibling directory and switching the paths in `index.html`;
keep the old directory until verified. Roll back by restoring those paths or
reverting the pilot commits. Service-specific styles belong in `style.css`.

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
forms, English fallbacks, static text, and profile files. No Python project or
Python application code is present, so Python lint/type/test checks do not apply.

For browser verification, exercise both datasets, typing, Enter, query retention,
no matches, request failure/retry, and blocked locale requests. Compare English
and Japanese with light/dark themes at 320, 390, 640, and 1280 px. Check wrapping,
keyboard order, skip link, focus, reduced motion, and forced colors. Check all
five vendored file digests against SOURCE.md after any snapshot update.

## License and data terms

This project's own code is available under the [MIT License](LICENSE). The terms
for the JAIBS bibliography data are unconfirmed; the MIT License does not apply
to that data. The vendored design snapshot has no upstream license notice at the
pinned commit. This repository's MIT License does not apply to those assets;
their terms must be confirmed by the upstream owner before publication.
