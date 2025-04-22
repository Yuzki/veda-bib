let datasets = [];
let currentData = {};

fetch("datasets.json")
    .then((res) => res.json())
    .then((list) => {
        datasets = list;
        const select = document.getElementById("dataset-select");
        list.forEach(ds => {
            const opt = document.createElement("option");
            opt.value = ds.file;
            opt.textContent = ds.label;
            select.appendChild(opt);
        });
        select.addEventListener("change", (e) => loadData(e.target.value));
        loadData(list[0].file); // 初期データ
    });

function loadData(file) {
    fetch(file)
        .then((res) => res.json())
        .then((json) => {
            currentData = json;
            renderList(Object.entries(currentData));
        });
}

document.getElementById("search").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const results = Object.entries(currentData).filter(([key, value]) =>
        key.toLowerCase().includes(query) ||
        (value.abbreviation || []).some((abbr) =>
            abbr.toLowerCase().includes(query)
        )
    );
    renderList(results);
});

function renderList(entries) {
    const ul = document.getElementById("results");
    ul.innerHTML = "";
    for (const [key, value] of entries) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${key}</strong><br/>
      ${value.abbreviation ? "略号: " + value.abbreviation.join(", ") + "<br/>" : ""}
      ${value.edition ? "<ul>" + value.edition.map((ed) =>
            `<li><em>${ed.author}</em>: ${ed.bibliography}</li>`
        ).join("") + "</ul>" : ""}`;
        ul.appendChild(li);
    }
}
