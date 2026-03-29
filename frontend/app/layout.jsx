"use client";

import { useEffect, useState } from "react";
import "./globals.css";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("scoreforge-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    setMounted(true);
  }, []);

  function toggleTheme(nextTheme) {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("scoreforge-theme", nextTheme);
  }

  if (!mounted) {
    return (
      <div className="theme-toggle" aria-hidden="true">
        <button className="theme-button active">Light</button>
        <button className="theme-button">Dark</button>
      </div>
    );
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Theme mode">
      <button
        type="button"
        className={theme === "light" ? "theme-button active" : "theme-button"}
        onClick={() => toggleTheme("light")}
      >
        Light
      </button>

      <button
        type="button"
        className={theme === "dark" ? "theme-button active" : "theme-button"}
        onClick={() => toggleTheme("dark")}
      >
        Dark
      </button>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <a href="/" className="brand">
                <div className="brand-mark">S</div>

                <div className="brand-copy">
                  <strong>Scoreforge</strong>
                  <span>Leaderboard SaaS for games</span>
                </div>
              </a>

              <nav className="topbar-nav">
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}