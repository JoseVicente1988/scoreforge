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

function useViewport() {
  const [width, setWidth] = useState(1400);

  useEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return function cleanup() {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return {
    width,
    isMobile: width <= 768,
    isTablet: width > 768 && width <= 1080,
  };
}

export default function Page() {
  const { isMobile, isTablet } = useViewport();

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

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "center",
      padding: isMobile ? "24px 16px 32px" : "36px 20px",
      color: "var(--text)",
    },
    shell: {
      width: "100%",
      maxWidth: "1200px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1.12fr 0.88fr",
      gap: isMobile ? "20px" : "30px",
      alignItems: "stretch",
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: isMobile ? "4px 2px" : "16px 8px",
      order: isMobile ? 2 : 1,
    },
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      color: "var(--text-soft)",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 700,
      letterSpacing: "0.02em",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
    },
    heroTitle: {
      margin: "18px 0 14px 0",
      fontSize: isMobile ? "34px" : isTablet ? "44px" : "56px",
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      color: "var(--text)",
      fontWeight: 900,
      maxWidth: isMobile ? "none" : "620px",
    },
    heroText: {
      margin: 0,
      maxWidth: isMobile ? "none" : "680px",
      color: "var(--text-soft)",
      fontSize: isMobile ? "15px" : "18px",
      lineHeight: isMobile ? 1.7 : 1.75,
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, minmax(0, 1fr))",
      gap: "14px",
      marginTop: isMobile ? "22px" : "30px",
    },
    featureCard: {
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "20px",
      padding: "18px",
      boxShadow:
        "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(18px) saturate(145%)",
      WebkitBackdropFilter: "blur(18px) saturate(145%)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    },
    featureTitle: {
      margin: 0,
      fontSize: "15px",
      fontWeight: 800,
      color: "var(--text)",
    },
    featureText: {
      marginTop: "8px",
      marginBottom: 0,
      color: "var(--text-soft)",
      fontSize: "14px",
      lineHeight: 1.6,
    },
    authWrap: {
      display: "flex",
      alignItems: isMobile ? "stretch" : "center",
      justifyContent: "center",
      order: isMobile ? 1 : 2,
    },
    authCard: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "470px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: isMobile ? "24px" : "30px",
      padding: isMobile ? "20px" : "28px",
      boxShadow:
        "var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(28px) saturate(155%)",
      WebkitBackdropFilter: "blur(28px) saturate(155%)",
      position: "relative",
      overflow: "hidden",
    },
    authCardGlow: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 42%, rgba(124,92,255,0.06) 100%)",
    },
    authInner: {
      position: "relative",
      zIndex: 1,
    },
    authHeader: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: "12px",
      justifyContent: "space-between",
      marginBottom: "22px",
    },
    tabs: {
      display: "inline-flex",
      width: isMobile ? "100%" : "fit-content",
      padding: "5px",
      borderRadius: "14px",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      gap: "6px",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      flexWrap: "wrap",
    },
    tabButton: {
      flex: isMobile ? 1 : "unset",
      border: "none",
      background: "transparent",
      color: "var(--text-muted)",
      padding: "10px 16px",
      borderRadius: "10px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    tabButtonActive: {
      background: "rgba(255,255,255,0.72)",
      color: "var(--text)",
      boxShadow: "0 6px 20px rgba(15,23,42,0.08)",
    },
    dashboardLink: {
      textDecoration: "none",
      color: "var(--text)",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "10px 14px",
      fontWeight: 700,
      whiteSpace: "nowrap",
      textAlign: "center",
      transition: "all 0.2s ease",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
    authTitle: {
      margin: 0,
      fontSize: isMobile ? "24px" : "30px",
      lineHeight: 1.08,
      fontWeight: 900,
      color: "var(--text)",
      letterSpacing: "-0.03em",
    },
    authSubtitle: {
      marginTop: "10px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.7,
      fontSize: isMobile ? "14px" : "15px",
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
      color: "var(--text-soft)",
    },
    input: {
      width: "100%",
      borderRadius: "14px",
      border: "1px solid var(--border)",
      background: "var(--surface-soft)",
      color: "var(--text)",
      padding: "14px 16px",
      fontSize: "15px",
      outline: "none",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 1px 2px rgba(15,23,42,0.02)",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
    inputFocus: {
      border: "1px solid rgba(37,99,235,0.70)",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
      background: "var(--surface-strong)",
    },
    submitButton: {
      marginTop: "4px",
      border: "none",
      borderRadius: "14px",
      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-secondary) 100%)",
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
      background: "var(--danger-bg)",
      border: "1px solid var(--danger-border)",
      color: "var(--danger-text)",
      fontSize: "14px",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
    messageSuccess: {
      marginTop: "4px",
      padding: "14px 16px",
      borderRadius: "14px",
      background: "var(--success-bg)",
      border: "1px solid var(--success-border)",
      color: "var(--success-text)",
      fontSize: "14px",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
  };

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
                e.currentTarget.style.boxShadow =
                  "0 14px 34px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.18)";
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
                e.currentTarget.style.boxShadow =
                  "0 14px 34px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.18)";
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
                e.currentTarget.style.boxShadow =
                  "0 14px 34px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.18)";
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
            <div style={styles.authCardGlow} />
            <div style={styles.authInner}>
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
                        e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (mode !== "login") {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-muted)";
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
                        e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (mode !== "register") {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-muted)";
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
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
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
          </div>
        </section>
      </div>
    </main>
  );
}