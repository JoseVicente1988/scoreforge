"use client";

import { useEffect, useState } from "react";
import { useLang } from "../../components/LanguageProvider";

const API = process.env.NEXT_PUBLIC_API_BASE;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export default function Dashboard() {
  const { t } = useLang();

  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const styles = {
    page: {
      minHeight: "100vh",
      color: "var(--text)",
      padding: "40px 20px"
    },
    shell: {
      maxWidth: "1100px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1
    },
    headerCard: {
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
    topActions: {
      marginLeft: "auto",
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    },
    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "160px",
      background: "var(--surface-soft)",
      color: "var(--text)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "10px 14px",
      textDecoration: "none",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      whiteSpace: "nowrap"
    },
    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "170px",
      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-secondary) 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      padding: "12px 16px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
      whiteSpace: "nowrap"
    },
    dangerButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "130px",
      background: "#ef4444",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      padding: "10px 14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
      whiteSpace: "nowrap"
    },
    subtitle: {
      marginTop: "12px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.6,
      maxWidth: "760px"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: "20px",
      marginTop: "24px"
    },
    card: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.16)",
      backdropFilter: "blur(20px) saturate(145%)",
      WebkitBackdropFilter: "blur(20px) saturate(145%)"
    },
    cardTitle: {
      margin: 0,
      fontSize: "20px",
      fontWeight: 800,
      letterSpacing: "-0.01em",
      color: "var(--text)"
    },
    muted: {
      marginTop: "8px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.6
    },
    form: {
      display: "flex",
      gap: "10px",
      marginTop: "18px",
      flexWrap: "wrap"
    },
    input: {
      flex: 1,
      minWidth: "220px",
      background: "var(--surface-soft)",
      color: "var(--text)",
      border: "1px solid rgba(15, 23, 42, 0.45)",
      borderRadius: "14px",
      padding: "14px 16px",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)"
    },
    inputFocus: {
      border: "1px solid rgba(37,99,235,0.85)",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
      background: "var(--surface-strong)"
    },
    messageError: {
      marginTop: "16px",
      padding: "14px 16px",
      borderRadius: "14px",
      background: "var(--danger-bg)",
      border: "1px solid var(--danger-border)",
      color: "var(--danger-text)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)"
    },
    keyBox: {
      marginTop: "18px",
      padding: "18px",
      borderRadius: "18px",
      background: "rgba(37,99,235,0.10)",
      border: "1px solid var(--border)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)"
    },
    keyLabel: {
      fontSize: "14px",
      color: "var(--text-soft)"
    },
    keyValue: {
      marginTop: "10px",
      fontFamily: "monospace",
      fontSize: "14px",
      lineHeight: 1.6,
      wordBreak: "break-all",
      color: "var(--text)",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)"
    },
    keyHint: {
      marginTop: "10px",
      fontSize: "13px",
      color: "var(--text-muted)"
    },
    projectList: {
      display: "grid",
      gap: "14px",
      marginTop: "18px"
    },
    projectCard: {
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "18px",
      padding: "18px",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)"
    },
    projectHeader: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    },
    projectName: {
      fontSize: "18px",
      fontWeight: 800,
      margin: 0,
      color: "var(--text)"
    },
    projectId: {
      marginTop: "6px",
      fontSize: "13px",
      color: "var(--text-muted)",
      wordBreak: "break-all"
    },
    empty: {
      padding: "18px",
      borderRadius: "16px",
      background: "var(--surface-soft)",
      color: "var(--text-muted)",
      border: "1px dashed var(--border)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)"
    },
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "14px",
      marginTop: "18px"
    },
    statCard: {
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "18px",
      padding: "18px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)"
    },
    statLabel: {
      fontSize: "13px",
      color: "var(--text-muted)"
    },
    statValue: {
      marginTop: "8px",
      fontSize: "30px",
      fontWeight: 800,
      color: "var(--text)"
    },
    statValueSmall: {
      marginTop: "8px",
      fontSize: "22px",
      fontWeight: 800,
      color: "var(--text)"
    }
  };

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/";
      return;
    }

    refresh();
  }, []);

  async function refresh() {
    setMsg("");

    try {
      const response = await fetch(`${API}/projects`, {
        headers: {
          ...authHeaders()
        }
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setMsg(data.detail || t("failedLoadProjects"));
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      setMsg(t("failedLoadProjects"));
    }
  }

  async function createProject(e) {
    e.preventDefault();
    setMsg("");
    setApiKey(null);

    try {
      const response = await fetch(`${API}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders()
        },
        body: JSON.stringify({
          name: newName
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMsg(data.detail || t("createProjectFailed"));
        return;
      }

      setNewName("");
      refresh();
    } catch (error) {
      setMsg(t("createProjectFailed"));
    }
  }

  async function createKey(projectId) {
    setMsg("");
    setApiKey(null);

    try {
      const response = await fetch(`${API}/projects/${projectId}/keys`, {
        method: "POST",
        headers: {
          ...authHeaders()
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setMsg(data.detail || t("apiKeyAlreadyExists"));
          return;
        }

        setMsg(data.detail || t("createKeyFailed"));
        return;
      }

      setApiKey(data.api_key);
    } catch (error) {
      setMsg(t("createKeyFailed"));
    }
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.headerCard}>
          <div style={styles.topBar}>
            <h1 style={styles.title}>{t("dashboardTitle")}</h1>

            <div style={styles.topActions}>
              <a
                href="/leaderboard"
                style={styles.secondaryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {t("viewLeaderboard")}
              </a>
              <button
                onClick={logout}
                style={styles.dangerButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 14px 26px rgba(239,68,68,0.20)";
                  e.currentTarget.style.filter = "brightness(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {t("logout")}
              </button>
            </div>
          </div>

          <p style={styles.subtitle}>{t("dashboardSubtitle")}</p>
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>{t("createProjectTitle")}</h2>
            <p style={styles.muted}>{t("createProjectText")}</p>

            <form onSubmit={createProject} style={styles.form}>
              <input
                placeholder={t("enterProjectName")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                required
                style={isInputFocused ? { ...styles.input, ...styles.inputFocus } : styles.input}
              />
              <button
                type="submit"
                style={styles.primaryButton}
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
                {t("createProject")}
              </button>
            </form>

            {msg ? <div style={styles.messageError}>{msg}</div> : null}

            {apiKey ? (
              <div style={styles.keyBox}>
                <div style={styles.keyLabel}>{t("yourApiKeyShownOnce")}</div>
                <div style={styles.keyValue}>{apiKey}</div>
                <div style={styles.keyHint}>{t("saveApiKeyNow")}</div>
              </div>
            ) : null}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>{t("overview")}</h2>
            <p style={styles.muted}>{t("overviewText")}</p>

            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>{t("projects")}</div>
                <div style={styles.statValue}>{projects.length}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>{t("apiMode")}</div>
                <div style={styles.statValueSmall}>{t("bearerApiKey")}</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card, marginTop: "20px" }}>
          <h2 style={styles.cardTitle}>{t("yourProjects")}</h2>
          <p style={styles.muted}>{t("yourProjectsText")}</p>

          <div style={styles.projectList}>
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  style={styles.projectCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 14px 28px rgba(15,23,42,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.12)";
                  }}
                >
                  <div style={styles.projectHeader}>
                    <div>
                      <p style={styles.projectName}>{project.name}</p>
                      <div style={styles.projectId}>
                        {t("projectId")}: {project.id}
                      </div>
                    </div>

                    <button
                      onClick={() => createKey(project.id)}
                      style={{ ...styles.primaryButton, marginLeft: "auto" }}
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
                      {t("generateApiKey")}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.empty}>{t("noProjectsYet")}</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}