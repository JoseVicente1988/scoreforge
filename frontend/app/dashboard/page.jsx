"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders() {
  const t = getToken();
  if (!t) return {};
  return {
    Authorization: `Bearer ${t}`,
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    color: "#f5f7fb",
    padding: "40px 20px",
    backgroundImage:
      "linear-gradient(rgba(8, 11, 20, 0.78), rgba(12, 16, 30, 0.88)), url('/backgrounds/scoreforge-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  },
  shell: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  headerCard: {
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
  topActions: {
    marginLeft: "auto",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    background: "rgba(255,255,255,0.10)",
    color: "#f5f7fb",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "12px",
    padding: "10px 14px",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #6ea8fe 0%, #8b5cf6 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(85, 105, 255, 0.35)",
  },
  dangerButton: {
    background: "#ff5d73",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  subtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "rgba(245,247,251,0.82)",
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
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.01em",
  },
  muted: {
    marginTop: "8px",
    marginBottom: 0,
    color: "rgba(245,247,251,0.76)",
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
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    padding: "14px 16px",
    outline: "none",
  },
  messageError: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(255,93,115,0.14)",
    border: "1px solid rgba(255,93,115,0.35)",
    color: "#ffd4da",
  },
  keyBox: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(110,168,254,0.12)",
    border: "1px solid rgba(110,168,254,0.30)",
  },
  keyLabel: {
    fontSize: "14px",
    color: "rgba(245,247,251,0.82)",
  },
  keyValue: {
    marginTop: "10px",
    fontFamily: "monospace",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "break-all",
    color: "#dbe8ff",
    background: "rgba(0,0,0,0.24)",
    borderRadius: "12px",
    padding: "12px",
  },
  keyHint: {
    marginTop: "10px",
    fontSize: "13px",
    color: "rgba(245,247,251,0.68)",
  },
  projectList: {
    display: "grid",
    gap: "14px",
    marginTop: "18px",
  },
  projectCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "18px",
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
  },
  projectId: {
    marginTop: "6px",
    fontSize: "13px",
    color: "rgba(245,247,251,0.66)",
    wordBreak: "break-all",
  },
  empty: {
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(245,247,251,0.72)",
    border: "1px dashed rgba(255,255,255,0.16)",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
    marginTop: "18px",
  },
  statCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "18px",
  },
  statLabel: {
    fontSize: "13px",
    color: "rgba(245,247,251,0.66)",
  },
  statValue: {
    marginTop: "8px",
    fontSize: "30px",
    fontWeight: 800,
  },
  statValueSmall: {
    marginTop: "8px",
    fontSize: "22px",
    fontWeight: 800,
  },
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState("");
  const [apiKey, setApiKey] = useState(null);

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
      const r = await fetch(`${API}/projects`, {
        headers: {
          ...authHeaders(),
        },
      });

      const data = await r.json().catch(() => []);

      if (!r.ok) {
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
      const r = await fetch(`${API}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
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
      const r = await fetch(`${API}/projects/${projectId}/keys`, {
        method: "POST",
        headers: {
          ...authHeaders(),
        },
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        if (r.status === 409) {
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
              <a href="/leaderboard" style={styles.secondaryButton}>
                View leaderboard
              </a>
              <button onClick={logout} style={styles.dangerButton}>
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
                required
                style={styles.input}
              />
              <button type="submit" style={styles.primaryButton}>
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
              projects.map((p) => (
                <div key={p.id} style={styles.projectCard}>
                  <div style={styles.projectHeader}>
                    <div>
                      <p style={styles.projectName}>{p.name}</p>
                      <div style={styles.projectId}>Project ID: {p.id}</div>
                    </div>

                    <button
                      onClick={() => createKey(p.id)}
                      style={{ ...styles.primaryButton, marginLeft: "auto" }}
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