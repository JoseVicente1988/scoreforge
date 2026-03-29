"use client";

import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

function asMessage(detail) {
  if (!detail) {
    return null;
  }

  if (typeof detail === "string") {
    return detail;
  }

  try {
    return JSON.stringify(detail);
  } catch {
    return String(detail);
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
    color: "#0f172a",
  },
  shell: {
    width: "100%",
    maxWidth: "1180px",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "28px",
    alignItems: "stretch",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px 8px",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(15,23,42,0.08)",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.02em",
    backdropFilter: "blur(10px)",
  },
  heroTitle: {
    margin: "18px 0 14px 0",
    fontSize: "54px",
    lineHeight: 1.02,
    letterSpacing: "-0.04em",
    color: "#0f172a",
    fontWeight: 900,
    maxWidth: "620px",
  },
  heroText: {
    margin: 0,
    maxWidth: "680px",
    color: "#334155",
    fontSize: "18px",
    lineHeight: 1.75,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "30px",
  },
  featureCard: {
    background: "rgba(255,255,255,0.52)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    backdropFilter: "blur(10px)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  featureTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 800,
    color: "#0f172a",
  },
  featureText: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  authWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  authCard: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(255,255,255,0.58)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
    backdropFilter: "blur(18px)",
  },
  authHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "space-between",
    marginBottom: "22px",
  },
  tabs: {
    display: "inline-flex",
    padding: "5px",
    borderRadius: "14px",
    background: "rgba(15,23,42,0.05)",
    border: "1px solid rgba(15,23,42,0.06)",
    gap: "6px",
  },
  tabButton: {
    border: "none",
    background: "transparent",
    color: "#475569",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  tabButtonActive: {
    background: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 6px 20px rgba(15,23,42,0.08)",
  },
  dashboardLink: {
    textDecoration: "none",
    color: "#0f172a",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },
  authTitle: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.1,
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "-0.03em",
  },
  authSubtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  form: {
    marginTop: "24px",
    display: "grid",
    gap: "16px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid #cfd8e3",
    background: "rgba(255,255,255,0.94)",
    color: "#0f172a",
    padding: "14px 16px",
    fontSize: "15px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  },
  inputFocus: {
    border: "1px solid #2563eb",
    boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
    background: "rgba(255,255,255,0.98)",
  },
  submitButton: {
    marginTop: "4px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    padding: "14px 18px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
  messageError: {
    marginTop: "4px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.18)",
    color: "#991b1b",
    fontSize: "14px",
  },
  messageSuccess: {
    marginTop: "4px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.18)",
    color: "#166534",
    fontSize: "14px",
  },
};

export default function Page() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    setMsg("");
    setIsError(false);
  }, [mode]);

  const title = useMemo(() => {
    if (mode === "register") {
      return "Create your account";
    }

    return "Welcome back";
  }, [mode]);

  const subtitle = useMemo(() => {
    if (mode === "register") {
      return "Create a dashboard account and start managing game leaderboard projects.";
    }

    return "Login to manage projects, generate API keys and control your leaderboard SaaS.";
  }, [mode]);

  function getInputStyle(name) {
    if (focusedField === name) {
      return { ...styles.input, ...styles.inputFocus };
    }

    return styles.input;
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (!API) {
      setMsg("Missing NEXT_PUBLIC_API_BASE in .env.local");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const response = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(asMessage(data.detail) || "Register failed");
        }

        setMsg("Account created successfully. You can now log in.");
        setIsError(false);
        setMode("login");
        return;
      }

      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(asMessage(data.detail) || "Login failed");
      }

      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg(err?.message || "Something went wrong");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <span style={styles.eyebrow}>Add leaderboards to your game easily</span>

          <h1 style={styles.heroTitle}>Manage a leaderboard for your game.</h1>

          <p style={styles.heroText}>
            Scoreforge is a multi-tenant leaderboard SaaS built for game developers.
            Create and manage leaderboards for your games without the hassle of
            building and maintaining your own backend. Focus on making great games
            while we handle the leaderboard infrastructure.
          </p>

          <div style={styles.featureGrid}>
            <div
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 34px rgba(15,23,42,0.09)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.06)";
              }}
            >
              <p style={styles.featureTitle}>Project-based setup</p>
              <p style={styles.featureText}>
                Create one project per game and keep every leaderboard isolated.
              </p>
            </div>

            <div
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 34px rgba(15,23,42,0.09)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.06)";
              }}
            >
              <p style={styles.featureTitle}>Secure API keys</p>
              <p style={styles.featureText}>
                Generate keys for game clients and backend integrations safely.
              </p>
            </div>

            <div
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 34px rgba(15,23,42,0.09)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.06)";
              }}
            >
              <p style={styles.featureTitle}>Fast integration</p>
              <p style={styles.featureText}>
                Connect your game quickly and focus on gameplay instead of backend work.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.authWrap}>
          <div style={styles.authCard}>
            <div style={styles.authHeader}>
              <div style={styles.tabs} role="tablist" aria-label="Authentication mode">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  aria-pressed={mode === "login"}
                  style={
                    mode === "login"
                      ? { ...styles.tabButton, ...styles.tabButtonActive }
                      : styles.tabButton
                  }
                  onMouseEnter={(e) => {
                    if (mode !== "login") {
                      e.currentTarget.style.background = "rgba(255,255,255,0.55)";
                      e.currentTarget.style.color = "#0f172a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mode !== "login") {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => setMode("register")}
                  aria-pressed={mode === "register"}
                  style={
                    mode === "register"
                      ? { ...styles.tabButton, ...styles.tabButtonActive }
                      : styles.tabButton
                  }
                  onMouseEnter={(e) => {
                    if (mode !== "register") {
                      e.currentTarget.style.background = "rgba(255,255,255,0.55)";
                      e.currentTarget.style.color = "#0f172a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mode !== "register") {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  Register
                </button>
              </div>

              <a
                href="/dashboard"
                style={styles.dashboardLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.borderColor = "#c7d7ee";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Dashboard
              </a>
            </div>

            <div>
              <h2 style={styles.authTitle}>{title}</h2>
              <p style={styles.authSubtitle}>{subtitle}</p>
            </div>

            <form onSubmit={submit} style={styles.form}>
              <div style={styles.field}>
                <label htmlFor="username" style={styles.label}>
                  Username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  required
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={getInputStyle("username")}
                />
              </div>

              {mode === "register" ? (
                <div style={styles.field}>
                  <label htmlFor="email" style={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    required
                    placeholder="Enter your email"
                    autoComplete="email"
                    style={getInputStyle("email")}
                  />
                </div>
              ) : null}

              <div style={styles.field}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  placeholder="Enter your password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  style={getInputStyle("password")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 16px 32px rgba(37,99,235,0.28)";
                    e.currentTarget.style.filter = "brightness(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(37,99,235,0.22)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {isSubmitting
                  ? mode === "register"
                    ? "Creating account..."
                    : "Logging in..."
                  : mode === "register"
                    ? "Create account"
                    : "Login"}
              </button>

              {msg ? (
                <div style={isError ? styles.messageError : styles.messageSuccess}>
                  {msg}
                </div>
              ) : null}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}