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

const FALLBACK = {
    "search.results.count": { one: "{count} entry (of {total})", other: "{count} entries (of {total})" },
    "search.meta.abbreviation": "Abbreviations",
    "search.meta.edition": "Editions",
    "search.status.loadingTitle": "Loading entries",
    "search.status.loadingBody": "You can keep changing your search term.",
    "search.status.emptyTitle": "No matching entries",
    "search.status.emptyBody": "Try a shorter search term or another dataset.",
    "search.status.errorTitle": "Could not load entries",
    "search.status.errorBody": "Your search term is preserved. Check your connection and try again.",
    "search.status.retry": "Try again",
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
    const cache = new Map();
    let datasets = [];
    let data = {};
    let state = "loading";
    let request = 0;

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
        results.setAttribute("aria-busy", String(state === "loading"));
        if (state !== "ready") {
            showStatus(state);
            return;
        }
        const entries = filterEntries(data, search.value);
        count.textContent = t("search.results.count", { count: entries.length, total: Object.keys(data).length });
        if (!entries.length) showStatus("empty");
        const fragment = document.createDocumentFragment();
        for (const [title, value] of entries) {
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

    function showStatus(kind) {
        const panel = element("div", undefined, `veda-status veda-status--${kind === "error" ? "error" : "info"}`);
        const icon = element("span", kind === "error" ? "!" : "i", "veda-status__icon");
        icon.setAttribute("aria-hidden", "true");
        const body = element("div", undefined, "veda-status__body");
        body.append(element("p", t(`search.status.${kind}Title`), "veda-status__title"), element("p", t(`search.status.${kind}Body`)));
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

    search.addEventListener("input", render);
    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        render();
    });
    select.addEventListener("change", () => loadData(select.value));
    document.addEventListener("veda:languagechange", render);
    loadDatasets();
}

if (typeof module !== "undefined") module.exports = { filterEntries, normalizeEditions, FALLBACK, formatFallback };
if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", init, { once: true });
