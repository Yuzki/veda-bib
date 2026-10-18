// Footer report link and vendored snapshot checks. Run with: node --test tests/*.test.cjs
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const web = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(web, "index.html"), "utf8");
const en = require("../locales/en.json");
const ja = require("../locales/ja.json");
const dir = path.join(web, "vendor/veda-design/0.1.0-pilot-0b90d3c");

test("footer has one report link for Veda Bib", () => {
    const links = html.match(/<a [^>]*data-veda-report-link[^>]*>/g) || [];
    assert.equal(links.length, 1);
    const tag = links[0];
    assert.match(tag, /data-veda-report-service="Veda Bib"/);
    assert.match(tag, /href="[^"]*template=report\.yml&amp;service=Veda%20Bib"/);
    assert.match(tag, /rel="[^"]*noopener/);
    assert.doesNotMatch(tag, /target=/);
    const noteId = 'id="' + tag.match(/aria-describedby="([^"]+)"/)[1] + '"';
    assert.ok(html.includes(noteId));
    assert.ok(html.indexOf(tag) < html.indexOf(noteId));
    assert.ok(html.indexOf(noteId) < html.indexOf('data-i18n="footer.rights"'));
});

test("report messages exist in both locales and match static text", () => {
    for (const messages of [en, ja]) {
        assert.ok(messages.footer.report);
        assert.ok(messages.footer.reportNote);
    }
    assert.ok(html.includes('data-i18n="footer.report">' + en.footer.report + "<"));
    assert.ok(html.includes('data-i18n="footer.reportNote">' + en.footer.reportNote + "<"));
});

test("vendored report.js adds service and page without query or hash", () => {
    const attrs = {
        href: "https://github.com/Yuzki/veda-ai-feedback/issues/new?template=report.yml&service=Veda%20Bib",
        "data-veda-report-service": "Veda Bib",
    };
    const link = { getAttribute: (name) => attrs[name] ?? null, setAttribute: (name, value) => (attrs[name] = value) };
    const context = {
        URL,
        location: new URL("http://localhost:8000/index.html?lang=en&q=test#x"),
        window: {},
        document: { readyState: "complete", querySelectorAll: () => [link] },
    };
    vm.runInNewContext(fs.readFileSync(path.join(dir, "scripts/report.js"), "utf8"), context);
    const url = new URL(attrs.href);
    assert.equal(url.searchParams.get("template"), "report.yml");
    assert.equal(url.searchParams.get("service"), "Veda Bib");
    assert.equal(url.searchParams.get("page"), "http://localhost:8000/index.html");
    assert.ok(context.window.VedaReport.SERVICES.includes("Veda Bib"));
});

test("vendored files match SOURCE.md digests", () => {
    const source = fs.readFileSync(path.join(dir, "SOURCE.md"), "utf8");
    const rows = [...source.matchAll(/^\| `((?:styles|scripts)\/[^`]+)` \| `([0-9a-f]{64})` \|$/gm)];
    assert.equal(rows.length, 6);
    for (const [, file, digest] of rows) {
        assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(dir, file))).digest("hex"), digest, file);
    }
});
