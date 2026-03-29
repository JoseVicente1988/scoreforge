"use client";

import { useEffect, useState } from "react";

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
    Authorization: `Bearer ${token}`,
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    color: "#0f172a",
    padding: "40px 20px",
  },
  shell: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  headerCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
    backdropFilter: "blur(10px)",
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
  topActions: {
    marginLeft: "auto",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    background: "rgba(255,255,255,0.92)",
    color: "#0f172a",
    border: "1px solid #dbe3ee",
    borderRadius: "12px",
    padding: "10px 14px",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
  dangerButton: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
  subtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#334155",
    lineHeight: 1.6,
    maxWidth: "760px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "20px",
    marginTop: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.84)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    color: "#0f172a",
  },
  muted: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
  },
  form: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "220px",
    background: "rgba(255,255,255,0.94)",
    color: "#0f172a",
    border: "1px solid #dbe3ee",
    borderRadius: "14px",
    padding: "14px 16px",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  },
  inputFocus: {
    border: "1px solid #2563eb",
    boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
    background: "rgba(255,255,255,0.98)",
  },
  messageError: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.20)",
    color: "#991b1b",
  },
  keyBox: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.14)",
  },
  keyLabel: {
    fontSize: "14px",
    color: "#334155",
  },
  keyValue: {
    marginTop: "10px",
    fontFamily: "monospace",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "break-all",
    color: "#0f172a",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #dbe3ee",
    borderRadius: "12px",
    padding: "12px",
  },
  keyHint: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#475569",
  },
  projectList: {
    display: "grid",
    gap: "14px",
    marginTop: "18px",
  },
  projectCard: {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "18px",
    padding: "18px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  projectHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  projectName: {
    fontSize: "18px",
    fontWeight: 800,
    margin: 0,
    color: "#0f172a",
  },
  projectId: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#475569",
    wordBreak: "break-all",
  },
  empty: {
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.64)",
    color: "#475569",
    border: "1px dashed #dbe3ee",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
    marginTop: "18px",
  },
  statCard: {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "18px",
    padding: "18px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#475569",
  },
  statValue: {
    marginTop: "8px",
    fontSize: "30px",
    fontWeight: 800,
    color: "#0f172a",
  },
  statValueSmall: {
    marginTop: "8px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f172a",
  },
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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
          ...authHeaders(),
        },
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setMsg(data.detail || "Failed to load projects");
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      setMsg("Failed to load projects");
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
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMsg(data.detail || "Create project failed");
        return;
      }

      setNewName("");
      refresh();
    } catch (error) {
      setMsg("Create project failed");
    }
  }

  async function createKey(projectId) {
    setMsg("");
    setApiKey(null);

    try {
      const response = await fetch(`${API}/projects/${projectId}/keys`, {
        method: "POST",
        headers: {
          ...authHeaders(),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setMsg(data.detail || "API key already exists. Rotate it if you lost it.");
          return;
        }

        setMsg(data.detail || "Create key failed");
        return;
      }

      setApiKey(data.api_key);
    } catch (error) {
      setMsg("Create key failed");
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
            <h1 style={styles.title}>Dashboard</h1>

            <div style={styles.topActions}>
              <a
                href="/leaderboard"
                style={styles.secondaryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.borderColor = "#c7d7ee";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#dbe3ee";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                View leaderboard
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
                Logout
              </button>
            </div>
          </div>

          <p style={styles.subtitle}>
            Manage your leaderboard projects, generate API keys for your game
            clients, and keep your backend workflow simple and clean.
          </p>
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Create a new project</h2>
            <p style={styles.muted}>
              Each game should have its own project. That keeps scoreboards
              isolated and easier to manage.
            </p>

            <form onSubmit={createProject} style={styles.form}>
              <input
                placeholder="Enter project name"
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
                  e.currentTarget.style.boxShadow = "0 10px 24px rgba(37,99,235,0.18)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                Create project
              </button>
            </form>

            {msg ? <div style={styles.messageError}>{msg}</div> : null}

            {apiKey ? (
              <div style={styles.keyBox}>
                <div style={styles.keyLabel}>Your API key (shown once)</div>
                <div style={styles.keyValue}>{apiKey}</div>
                <div style={styles.keyHint}>
                  Save it now. It will not be shown again.
                </div>
              </div>
            ) : null}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Overview</h2>
            <p style={styles.muted}>
              Quick summary of your current workspace state.
            </p>

            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Projects</div>
                <div style={styles.statValue}>{projects.length}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>API Mode</div>
                <div style={styles.statValueSmall}>Bearer + API Key</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card, marginTop: "20px" }}>
          <h2 style={styles.cardTitle}>Your projects</h2>
          <p style={styles.muted}>
            Generate a project key when you are ready to connect your game.
          </p>

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
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={styles.projectHeader}>
                    <div>
                      <p style={styles.projectName}>{project.name}</p>
                      <div style={styles.projectId}>Project ID: {project.id}</div>
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
                        e.currentTarget.style.boxShadow = "0 10px 24px rgba(37,99,235,0.18)";
                        e.currentTarget.style.filter = "brightness(1)";
                      }}
                    >
                      Generate API key
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.empty}>No projects yet.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}