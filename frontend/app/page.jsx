"use client";

import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

function asMessage(detail) {
  if (!detail) return null;
  if (typeof detail === "string") return detail;

  try {
    return JSON.stringify(detail);
  } catch {
    return String(detail);
  }
}

export default function Page() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">Game backend + web dashboard</span>

        <h1>Manage leaderboard projects with a cleaner frontend experience.</h1>

        <p className="hero-text">
          Scoreforge is a multi-tenant leaderboard SaaS for games. Create projects,
          generate API keys and connect your game clients to a simple score API.
        </p>

        <div className="feature-list">
          <div className="feature-item">
            <strong>Project-based setup</strong>
            <span>Create one project per game and keep data isolated.</span>
          </div>

          <div className="feature-item">
            <strong>API key flow</strong>
            <span>Generate secure keys for game clients and service integration.</span>
          </div>

          <div className="feature-item">
            <strong>Developer-friendly</strong>
            <span>Built for fast integration with backend services and game clients.</span>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === "login" ? "tab-button active" : "tab-button"}
              onClick={() => setMode("login")}
              aria-pressed={mode === "login"}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "register" ? "tab-button active" : "tab-button"}
              onClick={() => setMode("register")}
              aria-pressed={mode === "register"}
            >
              Register
            </button>
          </div>

          <a href="/dashboard" className="dashboard-link">
            Go to dashboard
          </a>
        </div>

        <div className="auth-copy">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          {mode === "register" && (
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "register"
                ? "Creating account..."
                : "Logging in..."
              : mode === "register"
                ? "Create account"
                : "Login"}
          </button>

          {msg && (
            <div className={isError ? "message-box error" : "message-box success"}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}