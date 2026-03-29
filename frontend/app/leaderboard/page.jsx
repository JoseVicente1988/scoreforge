"use client";

import { useState } from "react";
import { useLang } from "../../components/LanguageProvider";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Leaderboard() {
  const { t } = useLang();

  const [projectId, setProjectId] = useState("");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const styles = {
    page: {
      minHeight: "100vh",
      color: "var(--text)",
      padding: "40px 20px"
    },
    shell: {
      maxWidth: "1000px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1
    },
    header: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(22px) saturate(150%)",
      WebkitBackdropFilter: "blur(22px) saturate(150%)"
    },
    topBar: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap"
    },
    title: {
      margin: 0,
      fontSize: "32px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "var(--text)"
    },
    backLink: {
      marginLeft: "auto",
      textDecoration: "none",
      color: "var(--text)",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "10px 14px",
      fontWeight: 600,
      transition: "all 0.2s ease",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)"
    },
    subtitle: {
      marginTop: "12px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.6,
      maxWidth: "720px"
    },
    card: {
      marginTop: "22px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.16)",
      backdropFilter: "blur(20px) saturate(145%)",
      WebkitBackdropFilter: "blur(20px) saturate(145%)"
    },
    formRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    },
    input: {
      flex: 1,
      minWidth: "240px",
      background: "var(--surface-soft)",
      color: "var(--text)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "14px 16px",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)"
    },
    inputFocus: {
      border: "1px solid rgba(37,99,235,0.70)",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
      background: "var(--surface-strong)"
    },
    button: {
      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-secondary) 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      padding: "12px 16px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease"
    },
    message: {
      marginTop: "16px",
      padding: "14px 16px",
      borderRadius: "14px",
      background: "var(--danger-bg)",
      border: "1px solid var(--danger-border)",
      color: "var(--danger-text)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)"
    },
    empty: {
      marginTop: "18px",
      padding: "18px",
      borderRadius: "16px",
      background: "var(--surface-soft)",
      color: "var(--text-muted)",
      border: "1px dashed var(--border)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)"
    },
    tableWrap: {
      marginTop: "18px",
      overflowX: "auto",
      borderRadius: "18px",
      border: "1px solid var(--border)",
      background: "var(--surface-soft)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "500px"
    },
    th: {
      textAlign: "left",
      padding: "16px",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-muted)",
      borderBottom: "1px solid var(--border)"
    },
    td: {
      padding: "16px",
      borderBottom: "1px solid var(--border)",
      color: "var(--text)"
    },
    rank: {
      width: "90px",
      fontWeight: 800,
      color: "var(--primary)"
    },
    username: {
      fontWeight: 700,
      color: "var(--text)"
    },
    score: {
      textAlign: "right",
      fontWeight: 800,
      color: "var(--text)"
    }
  };

  async function load() {
    setMsg("");
    setRows([]);

    if (!projectId.trim()) {
      setMsg(t("pleaseEnterProjectId"));
      return;
    }

    try {
      const response = await fetch(`${API}/scores/leaderboard/${projectId}?limit=20`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMsg(data.detail || t("failedLoadLeaderboard"));
        return;
      }

      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setMsg(t("failedLoadLeaderboard"));
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.header}>
          <div style={styles.topBar}>
            <h1 style={styles.title}>{t("leaderboardTitle")}</h1>
            <a
              href="/dashboard"
              style={styles.backLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {t("backToDashboard")}
            </a>
          </div>

          <p style={styles.subtitle}>{t("leaderboardSubtitle")}</p>
        </section>

        <section style={styles.card}>
          <div style={styles.formRow}>
            <input
              placeholder={t("enterProjectId")}
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
              {t("loadLeaderboard")}
            </button>
          </div>

          {msg ? <div style={styles.message}>{msg}</div> : null}

          {rows.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{t("rank")}</th>
                    <th style={styles.th}>{t("username")}</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>{t("score")}</th>
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
            <div style={styles.empty}>{t("noLeaderboardData")}</div>
          )}
        </section>
      </div>
    </main>
  );
}