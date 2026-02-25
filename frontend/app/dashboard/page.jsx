"use client";

import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState("");
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    if (!getToken()) window.location.href = "/";
    refresh();
  }, []);

  async function refresh() {
    setMsg("");
    const r = await fetch(`${API}/projects`, { headers: { ...authHeaders() } });
    const data = await r.json();
    if (!r.ok) return setMsg(data.detail || "Failed to load projects");
    setProjects(data);
  }

  async function createProject(e) {
    e.preventDefault();
    setMsg("");
    setApiKey(null);
    const r = await fetch(`${API}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ name: newName }),
    });
    const data = await r.json();
    if (!r.ok) return setMsg(data.detail || "Create project failed");
    setNewName("");
    refresh();
  }

  async function createKey(projectId) {
    setMsg("");
    setApiKey(null);
    const r = await fetch(`${API}/projects/${projectId}/keys`, {
      method: "POST",
      headers: { ...authHeaders() },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (r.status === 409) return setMsg(data.detail || "API key already exists. Rotate it if you lost it.");
      return setMsg(data.detail || "Create key failed");
    }
    setApiKey(data.api_key);
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Dashboard</h1>
        <a href="/leaderboard" style={{ marginLeft: "auto" }}>Leaderboard →</a>
        <button onClick={logout}>Logout</button>
      </div>

      <p style={{ color: "#444" }}>Generate API keys for your Godot games.</p>

      <form onSubmit={createProject} style={{ display: "flex", gap: 8, maxWidth: 520 }}>
        <input placeholder="New project name" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ flex: 1 }} />
        <button type="submit">Create</button>
      </form>

      {msg && <div style={{ color: "#b00020", marginTop: 10 }}>{msg}</div>}

      {apiKey && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Your API key (shown once):</strong>
          <div style={{ marginTop: 8, fontFamily: "monospace" }}>{apiKey}</div>
          <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>Save it now. It will not be shown again.</div>
        </div>
      )}

      <h2 style={{ fontSize: 18, marginTop: 22 }}>Your projects</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {projects.map((p) => (
          <div key={p.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <strong>{p.name}</strong>
                <div style={{ color: "#666", fontSize: 13 }}>Project ID: {p.id}</div>
              </div>
              <button onClick={() => createKey(p.id)} style={{ marginLeft: "auto" }}>Generate API key</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div style={{ color: "#666" }}>No projects yet.</div>}
      </div>
    </div>
  );
}
