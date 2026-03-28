"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

const styles = {
  page: {
    minHeight: "100vh",
    color: "#0f172a",
    padding: "40px 20px",
  },
  shell: {
    maxWidth: "1000px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
    backdropFilter: "blur(12px)",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  backLink: {
    marginLeft: "auto",
    textDecoration: "none",
    color: "#f5f7fb",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 600,
  },
  subtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "rgba(245,247,251,0.80)",
    lineHeight: 1.6,
    maxWidth: "720px",
  },
  card: {
    marginTop: "22px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
  },
  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "240px",
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    padding: "14px 16px",
    outline: "none",
  },
  button: {
    background: "linear-gradient(135deg, #6ea8fe 0%, #8b5cf6 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(85, 105, 255, 0.35)",
  },
  message: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(255,93,115,0.14)",
    border: "1px solid rgba(255,93,115,0.35)",
    color: "#ffd4da",
  },
  empty: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(245,247,251,0.72)",
    border: "1px dashed rgba(255,255,255,0.16)",
  },
  tableWrap: {
    marginTop: "18px",
    overflowX: "auto",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "500px",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(245,247,251,0.66)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  rank: {
    width: "90px",
    fontWeight: 800,
    color: "#9dc1ff",
  },
  username: {
    fontWeight: 700,
  },
  score: {
    textAlign: "right",
    fontWeight: 800,
    color: "#ffffff",
  },
};

export default function Leaderboard() {
  const [projectId, setProjectId] = useState("");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    setRows([]);

    if (!projectId.trim()) {
      setMsg("Please enter a project ID.");
      return;
    }

    const r = await fetch(`${API}/scores/leaderboard/${projectId}?limit=20`);
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      setMsg(data.detail || "Failed to load leaderboard");
      return;
    }

    setRows(data);
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.header}>
          <div style={styles.topBar}>
            <h1 style={styles.title}>Leaderboard</h1>
            <a href="/dashboard" style={styles.backLink}>
              Back to dashboard
            </a>
          </div>

          <p style={styles.subtitle}>
            Load the public leaderboard of any project using its project ID.
          </p>
        </section>

        <section style={styles.card}>
          <div style={styles.formRow}>
            <input
              placeholder="Enter Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              style={styles.input}
            />
            <button onClick={load} style={styles.button}>
              Load leaderboard
            </button>
          </div>

          {msg ? <div style={styles.message}>{msg}</div> : null}

          {rows.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Rank</th>
                    <th style={styles.th}>Username</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ ...styles.td, ...styles.rank }}>#{idx + 1}</td>
                      <td style={{ ...styles.td, ...styles.username }}>
                        {row.username}
                      </td>
                      <td style={{ ...styles.td, ...styles.score }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.empty}>No leaderboard data loaded yet.</div>
          )}
        </section>
      </div>
    </main>
  );
}