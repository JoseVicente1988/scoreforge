"use client";

import { useEffect, useState } from "react";
import { LanguageProvider, useLang } from "../components/LanguageProvider";
import "./globals.css";

function ThemeToggle() {
  const { t } = useLang();
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
        <button className="theme-button active" title={t("themeLight")} aria-label={t("themeLight")}>
          ☀️
        </button>
        <button className="theme-button" title={t("themeDark")} aria-label={t("themeDark")}>
          🌙
        </button>
      </div>
    );
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Theme mode">
      <button
        type="button"
        className={theme === "light" ? "theme-button active" : "theme-button"}
        onClick={() => toggleTheme("light")}
        title={t("themeLight")}
        aria-label={t("themeLight")}
      >
        ☀️
      </button>

      <button
        type="button"
        className={theme === "dark" ? "theme-button active" : "theme-button"}
        onClick={() => toggleTheme("dark")}
        title={t("themeDark")}
        aria-label={t("themeDark")}
      >
        🌙
      </button>
    </div>
  );
}

function LanguageToggle() {
  const { lang, changeLang } = useLang();

  return (
    <div className="theme-toggle" role="group" aria-label="Language selector">
      <button
        type="button"
        className={lang === "en" ? "theme-button active" : "theme-button"}
        onClick={() => changeLang("en")}
        title="English"
        aria-label="English"
      >
        🇺🇸
      </button>

      <button
        type="button"
        className={lang === "es" ? "theme-button active" : "theme-button"}
        onClick={() => changeLang("es")}
        title="Español"
        aria-label="Español"
      >
        🇪🇸
      </button>
    </div>
  );
}

function LayoutContent({ children }) {
  const { t } = useLang();

  return (
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
            <a href="/">{t("navHome")}</a>
            <a href="/dashboard">{t("navDashboard")}</a>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}