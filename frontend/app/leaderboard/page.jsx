"use client";

import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Leaderboard() {
  const [projectId, setProjectId] = useState("");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    setRows([]);
    const r = await fetch(`${API}/scores/leaderboard/${projectId}?limit=20`);
    const data = await r.json();
    if (!r.ok) return setMsg(data.detail || "Failed to load leaderboard");
    setRows(data);
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginTop: 0 }}>Leaderboard</h1>
      <div style={{ display: "flex", gap: 8, maxWidth: 420 }}>
        <input placeholder="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} style={{ flex: 1 }} />
        <button onClick={load}>Load</button>
        <a href="/dashboard" style={{ marginLeft: "auto" }}>Back →</a>
      </div>
      {msg && <div style={{ color: "#b00020", marginTop: 10 }}>{msg}</div>}
      <div style={{ marginTop: 16 }}>
        {rows.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Username</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f1f1" }}>{r.username}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f1f1f1", textAlign: "right" }}>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#666" }}>No data loaded.</div>
        )}
      </div>
    </div>
  );
}
