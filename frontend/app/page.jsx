"use client";

import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE;

function asMessage(detail) {
  if (!detail) return null;
  if (typeof detail === "string") return detail;
  try { return JSON.stringify(detail); } catch { return String(detail); }
}

export default function Page() {
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg("");
  }, [mode]);

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (!API) {
      setMsg("Missing NEXT_PUBLIC_API_BASE in .env.local");
      return;
    }

    try {
      if (mode === "register") {
        const r = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(asMessage(data.detail) || "Register failed");
        setMsg("Registered. Please login.");
        setMode("login");
        return;
      }

      // /auth/login uses OAuth2PasswordRequestForm (x-www-form-urlencoded)
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(asMessage(data.detail) || "Login failed");

      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg(err?.message || "Error");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ marginBottom: 6 }}>Scoreforge</h1>
      <p style={{ marginTop: 0, color: "#555" }}>Create a project per game and generate API keys for scoreboards.</p>

      <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>Login</button>
        <button onClick={() => setMode("register")} disabled={mode === "register"}>Register</button>
        <a href="/dashboard" style={{ marginLeft: "auto", alignSelf: "center" }}>Dashboard →</a>
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%" }} />
        </label>

        {mode === "register" && (
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%" }} />
          </label>
        )}

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </label>

        <button type="submit">{mode === "register" ? "Create account" : "Login"}</button>
        {msg && <div style={{ color: "#b00020" }}>{msg}</div>}
      </form>
    </div>
  );
}
