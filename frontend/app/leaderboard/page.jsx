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
    background: "rgba(255,255,255,0.24)",
    border: "1px solid rgba(255,255,255,0.36)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0 24px 60px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.34)",
    backdropFilter: "blur(22px) saturate(150%)",
    WebkitBackdropFilter: "blur(22px) saturate(150%)",
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
    color: "#0f172a",
  },
  backLink: {
    marginLeft: "auto",
    textDecoration: "none",
    color: "#0f172a",
    background: "rgba(255,255,255,0.26)",
    border: "1px solid rgba(255,255,255,0.36)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 600,
    transition: "all 0.2s ease",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },
  subtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#334155",
    lineHeight: 1.6,
    maxWidth: "720px",
  },
  card: {
    marginTop: "22px",
    background: "rgba(255,255,255,0.22)",
    border: "1px solid rgba(255,255,255,0.34)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0 20px 48px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.30)",
    backdropFilter: "blur(20px) saturate(145%)",
    WebkitBackdropFilter: "blur(20px) saturate(145%)",
  },
  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "240px",
    background: "rgba(255,255,255,0.38)",
    color: "#0f172a",
    border: "1px solid rgba(255,255,255,0.40)",
    borderRadius: "14px",
    padding: "14px 16px",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24)",
  },
  inputFocus: {
    border: "1px solid rgba(37,99,235,0.70)",
    boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
    background: "rgba(255,255,255,0.48)",
  },
  button: {
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
  message: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.20)",
    color: "#991b1b",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  empty: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.18)",
    color: "#475569",
    border: "1px dashed rgba(255,255,255,0.34)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },
  tableWrap: {
    marginTop: "18px",
    overflowX: "auto",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.34)",
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
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
    color: "#475569",
    borderBottom: "1px solid rgba(255,255,255,0.28)",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.22)",
    color: "#0f172a",
  },
  rank: {
    width: "90px",
    fontWeight: 800,
    color: "#2563eb",
  },
  username: {
    fontWeight: 700,
    color: "#0f172a",
  },
  score: {
    textAlign: "right",
    fontWeight: 800,
    color: "#0f172a",
  },
};

export default function Leaderboard() {
  const [projectId, setProjectId] = useState("");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  async function load() {
    setMsg("");
    setRows([]);

    if (!projectId.trim()) {
      setMsg("Please enter a project ID.");
      return;
    }

    try {
      const response = await fetch(`${API}/scores/leaderboard/${projectId}?limit=20`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMsg(data.detail || "Failed to load leaderboard");
        return;
      }

      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setMsg("Failed to load leaderboard");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.header}>
          <div style={styles.topBar}>
            <h1 style={styles.title}>Leaderboard</h1>
            <a
              href="/dashboard"
              style={styles.backLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.34)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,0.26)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
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
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              style={isInputFocused ? { ...styles.input, ...styles.inputFocus } : styles.input}
            />
            <button
              onClick={load}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 16px 30px rgba(37,99,235,0.24)";
                e.currentTarget.style.filter = "brightness(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(37,99,235,0.22)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
            >
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
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td style={{ ...styles.td, ...styles.rank }}>#{index + 1}</td>
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