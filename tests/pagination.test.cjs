// Pagination and page-markup checks. Run with: node --test tests/*.test.cjs
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { filterEntries, paginate, PAGE_SIZE, formatFallback } = require("../script.js");

const web = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(web, "index.html"), "utf8");
const en = require("../locales/en.json");
const ja = require("../locales/ja.json");

test("paginate: bounds, ranges, empty and clamped pages", () => {
    assert.equal(PAGE_SIZE, 50);
    assert.deepEqual(paginate(0, 1), { page: 1, pages: 1, offset: 0, from: 0, to: 0 });
    assert.deepEqual(paginate(50, 1), { page: 1, pages: 1, offset: 0, from: 1, to: 50 });
    assert.deepEqual(paginate(51, 2), { page: 2, pages: 2, offset: 50, from: 51, to: 51 });
    assert.deepEqual(paginate(138, 3), { page: 3, pages: 3, offset: 100, from: 101, to: 138 });
    assert.equal(paginate(138, 9).page, 3);
    assert.equal(paginate(138, 0).page, 1);
    assert.equal(paginate(138, NaN).page, 1);
});

test("pages together show every entry once, in the original order", () => {
    for (const file of ["jaibs-1", "jaibs-2"]) {
        for (const query of ["", "a"]) {
            const entries = filterEntries(require(`../${file}.json`), query);
            const seen = [];
            const { pages } = paginate(entries.length, 1);
            for (let page = 1; page <= pages; page++) {
                const view = paginate(entries.length, page);
                assert.equal(view.page, page);
                seen.push(...entries.slice(view.offset, view.offset + PAGE_SIZE));
            }
            assert.deepEqual(seen, entries, `${file} "${query}"`);
        }
    }
});

test("pagination range uses plural forms and interpolation", () => {
    const key = ["search", "pagination", "range"];
    const pick = (messages) => key.reduce((node, name) => node[name], messages);
    assert.equal(pick(en).one, "Showing {from}–{to} of {count} entry");
    assert.equal(pick(en).other, "Showing {from}–{to} of {count} entries");
    assert.equal(pick(ja).other, "{from}–{to}件目 / 全{count}件");
    assert.equal(formatFallback("search.pagination.range", { from: 51, to: 100, count: 1200 }), "Showing 51–100 of 1,200 entries");
    assert.equal(formatFallback("search.pagination.range", { from: 1, to: 1, count: 1 }), "Showing 1–1 of 1 entry");
    assert.equal(formatFallback("search.pagination.page", { page: 2, pages: 3 }), "Page 2 of 3");
});

test("page markup: settings popover, jump link, results heading and pagination nav", () => {
    assert.match(html, /<details class="veda-settings" data-veda-settings hidden>/);
    assert.ok(html.indexOf("data-veda-settings") < html.indexOf('id="veda-language"'));
    assert.ok(html.indexOf('id="veda-language"') < html.indexOf('id="veda-theme"'));
    const scripts = [...html.matchAll(/<script src="[^"]*scripts\/(\w+)\.js"([^>]*)>/g)];
    const names = scripts.map((m) => m[1]);
    assert.deepEqual(names.slice(0, 3), ["settings", "theme", "i18n"]);
    assert.equal(names.filter((n) => n === "settings").length, 1);
    assert.doesNotMatch(scripts[0][2], /defer|async/);
    assert.doesNotMatch(scripts[1][2], /defer|async/);
    assert.match(scripts[2][2], /\bdefer\b/);
    assert.ok(html.indexOf("scripts/i18n.js") < html.indexOf("</head>"));
    assert.match(html, /class="veda-search veda-search--responsive/);
    assert.match(html, /<a href="#results-title" id="goto-results"/);
    assert.match(html, /<h2 id="results-title"[^>]*tabindex="-1"/);
    assert.match(html, /<nav class="veda-pagination" id="pagination"[^>]* hidden>/);
    assert.ok(html.indexOf('id="results-title"') < html.indexOf('id="pagination"'));
});
