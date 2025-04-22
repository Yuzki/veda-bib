import React, { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 初期表示で全件取得
  useEffect(() => {
    setLoading(true);
    fetch(`/search`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${ res.status } `);
        return res.json();
      })
      .then((data) => {
        setEntries(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Fetch error", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // クエリが入力されたときだけ検索実行
  useEffect(() => {
    if (query === "") return;
    setLoading(true);
    fetch(`/search?q=${query}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${ res.status } `);
        return res.json();
      })
      .then((data) => {
        setEntries(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Fetch error", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>JAIBS Viewer</h1>
      <input
        style={{ marginTop: '1rem', marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
        type="text"
        placeholder="検索語を入力..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
      <p>データ件数: {Object.keys(entries).length}</p>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(entries).map(([key, value]: any) => (
          <li key={key} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h2>{key}</h2>
            {Array.isArray(value.abbreviation) && <p>略語: {value.abbreviation.join(", ")}</p>}
            {Array.isArray(value.edition) && (
              <ul>
                {value.edition.map((ed: any, idx: number) => (
                  <li key={idx}>
                    <strong>{ed.author}:</strong> {ed.bibliography}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


// import React, { useState, useEffect } from "react";

// function App() {
//   const [query, setQuery] = useState("");
//   const [entries, setEntries] = useState({});

//   useEffect(() => {
//     fetch(`/search?q=${query}`)
//       .then((res) => res.json())
//       .then((data) => setEntries(data));
//   }, [query]);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">JAIBS Viewer</h1>
//       <input
//         className="border p-2 mb-4 w-full"
//         type="text"
//         placeholder="検索語を入力..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <ul className="space-y-2">
//         {Object.entries(entries).map(([key, value]: any) => (
//           <li key={key} className="border rounded p-2">
//             <h2 className="font-semibold">{key}</h2>
//             {value.abbreviation && <p>略語: {value.abbreviation.join(", ")}</p>}
//             {value.edition && (
//               <ul className="list-disc ml-5">
//                 {value.edition.map((ed: any, idx: number) => (
//                   <li key={idx}>
//                     <strong>{ed.author}:</strong> {ed.bibliography}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;