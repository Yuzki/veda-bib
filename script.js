"use strict";

function filterEntries(data, query) {
    const lower = query.toLowerCase();
    return Object.entries(data).filter(([title, value]) =>
        title.toLowerCase().includes(lower) ||
        (value.abbreviation || []).some((abbr) => abbr.toLowerCase().includes(lower))
    );
}

function normalizeEditions(edition) {
    if (!edition) return [];
    return Array.isArray(edition) ? edition : [edition];
}

const PAGE_SIZE = 50;

// Clamps `page` into range and returns the 1-based range shown on it.
function paginate(total, page, size = PAGE_SIZE) {
    const pages = Math.max(1, Math.ceil(total / size));
    const current = Math.min(Math.max(Number.isInteger(page) ? page : 1, 1), pages);
    const offset = (current - 1) * size;
    return { page: current, pages, offset, from: total ? offset + 1 : 0, to: Math.min(offset + size, total) };
}

const FALLBACK = {
    "search.results.count": { one: "{count} entry (of {total})", other: "{count} entries (of {total})" },
    "search.jump.link": "Go to results",
    "search.pagination.prev": "Previous",
    "search.pagination.next": "Next",
    "search.pagination.page": "Page {page} of {pages}",
    "search.pagination.range": "Items {from}–{to}",
    "search.meta.abbreviation": "Abbreviations",
    "search.meta.edition": "Editions",
    "search.status.loadingTitle": "Loading literature",
    "search.status.emptyTitle": "No matching literature",
    "search.status.emptyBody": "Try a shorter search term or another literature type.",
    "search.status.errorTitle": "Could not load literature",
    "search.status.errorBody": "Try loading again.",
    "search.status.retry": "Reload",
    "search.datasets.jaibs-1": "Primary literature",
    "search.datasets.jaibs-2": "Secondary literature",
};

function formatFallback(key, params = {}) {
    let value = FALLBACK[key] ?? key;
    if (typeof value === "object") value = value[params.count === 1 ? "one" : "other"];
    return value.replace(/\{(\w+)\}/g, (match, name) =>
        name in params ? (typeof params[name] === "number" ? new Intl.NumberFormat("en").format(params[name]) : String(params[name])) : match
    );
}

function init() {
    const select = document.getElementById("dataset-select");
    const search = document.getElementById("search");
    const results = document.getElementById("results");
    const count = document.getElementById("result-count");
    const status = document.getElementById("search-status");
    const heading = document.getElementById("results-title");
    const nav = document.getElementById("pagination");
    const cache = new Map();
    let datasets = [];
    let data = {};
    let state = "loading";
    let request = 0;
    let page = 1;

    function t(key, params) {
        if (window.VedaI18n?.lang) {
            const translated = window.VedaI18n.t(key, params);
            if (translated !== key) return translated;
        }
        return formatFallback(key, params);
    }

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    }

    function source(tag, text, className) {
        const node = element(tag, text, className);
        // Mixed source languages are unknown, independent of the UI language.
        node.lang = "";
        return node;
    }

    function render() {
        for (const [i, ds] of datasets.entries()) {
            const key = `search.datasets.${ds.id}`;
            const label = t(key);
            select.options[i].textContent = label === key ? ds.label : label;
        }
        results.replaceChildren();
        status.replaceChildren();
        count.textContent = "";
        nav.hidden = true;
        results.setAttribute("aria-busy", String(state === "loading"));
        if (state !== "ready") {
            showStatus(state);
            return;
        }
        const entries = filterEntries(data, search.value);
        const summary = t("search.results.count", { count: entries.length, total: Object.keys(data).length });
        count.textContent = summary; // the only live region and the only place the total appears
        if (!entries.length) showStatus("empty");
        const view = paginate(entries.length, page);
        page = view.page;
        renderPagination(view);
        const fragment = document.createDocumentFragment();
        for (const [title, value] of entries.slice(view.offset, view.offset + PAGE_SIZE)) {
            const li = element("li", undefined, "veda-result");
            li.append(source("h3", title, "veda-result__title"));
            const meta = element("dl", undefined, "veda-meta");
            if (value.abbreviation?.length) {
                meta.append(element("dt", t("search.meta.abbreviation")), source("dd", value.abbreviation.join(", "), "bib-abbreviations"));
            }
            const editions = normalizeEditions(value.edition);
            if (editions.length) {
                const dd = element("dd");
                const list = source("ul", undefined, "bib-editions");
                for (const ed of editions) {
                    const item = element("li");
                    if (ed.author) item.append(element("em", ed.author), document.createTextNode(": "));
                    item.append(document.createTextNode(ed.bibliography ?? ""));
                    list.append(item);
                }
                dd.append(list);
                meta.append(element("dt", t("search.meta.edition")), dd);
            }
            li.append(meta);
            fragment.append(li);
        }
        results.append(fragment);
    }

    function renderPagination(view) {
        nav.hidden = view.pages === 1;
        document.getElementById("pagination-range").textContent = t("search.pagination.range", { from: view.from, to: view.to });
        document.getElementById("page-current").textContent = t("search.pagination.page", { page: view.page, pages: view.pages });
        document.getElementById("page-prev").disabled = view.page === 1;
        document.getElementById("page-next").disabled = view.page === view.pages;
    }

    // An explicit page move shows the new page and lands on the results heading.
    function goToPage(next) {
        page = next;
        render();
        heading.focus();
    }

    function showStatus(kind) {
        const panel = element("div", undefined, `veda-status veda-status--${kind === "error" ? "error" : "info"}`);
        const icon = element("span", kind === "error" ? "!" : "i", "veda-status__icon");
        icon.setAttribute("aria-hidden", "true");
        const body = element("div", undefined, "veda-status__body");
        body.append(element("p", t(`search.status.${kind}Title`), "veda-status__title"));
        if (kind !== "loading") body.append(element("p", t(`search.status.${kind}Body`)));
        if (kind === "error") {
            const retry = element("button", t("search.status.retry"), "veda-button");
            retry.type = "button";
            retry.addEventListener("click", () => datasets.length ? loadData(select.value) : loadDatasets());
            body.append(retry);
        }
        panel.append(icon, body);
        status.append(panel);
    }

    async function fetchJson(file) {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    async function loadData(file) {
        const token = ++request;
        state = "loading";
        page = 1;
        render();
        try {
            const loaded = cache.has(file) ? cache.get(file) : await fetchJson(file);
            if (!loaded || typeof loaded !== "object" || Array.isArray(loaded)) throw new Error("Invalid dataset");
            cache.set(file, loaded);
            if (token !== request) return;
            data = loaded;
            state = "ready";
        } catch {
            if (token !== request) return;
            state = "error";
        }
        render();
    }

    async function loadDatasets() {
        state = "loading";
        render();
        try {
            const list = await fetchJson("datasets.json");
            if (!Array.isArray(list) || !list.length || list.some((ds) => !ds || typeof ds.file !== "string" || typeof ds.id !== "string" || typeof ds.label !== "string")) throw new Error("Invalid dataset list");
            datasets = list;
            select.replaceChildren(...list.map((ds) => {
                const option = element("option", ds.label);
                option.value = ds.file;
                return option;
            }));
            select.disabled = false;
            await loadData(select.value);
        } catch {
            state = "error";
            render();
        }
    }

    search.addEventListener("input", () => {
        page = 1;
        render();
    });
    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        page = 1;
        render();
    });
    document.getElementById("page-prev").addEventListener("click", () => goToPage(page - 1));
    document.getElementById("page-next").addEventListener("click", () => goToPage(page + 1));
    document.querySelector(".veda-search-jump").hidden = false; // the jump line needs this script
    document.getElementById("goto-results").addEventListener("click", (event) => {
        event.preventDefault();
        heading.focus();
    });
    select.addEventListener("change", () => loadData(select.value));
    document.addEventListener("veda:languagechange", render);
    loadDatasets();
}

if (typeof module !== "undefined") module.exports = { filterEntries, normalizeEditions, paginate, PAGE_SIZE, FALLBACK, formatFallback };
if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", init, { once: true });
