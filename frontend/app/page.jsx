"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "../components/LanguageProvider";

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
    isTablet: width > 768 && width <= 1080
  };
}

function renderHighlightedLine(line) {
  const keywordPattern = /^(extends|class_name|const|func|var|return|if|await)$/;
  const decoratorPattern = /^@export$/;
  const boolNullPattern = /^(true|false|null)$/;
  const methodPattern = /^(HTTPClient\.METHOD_POST|HTTPClient\.METHOD_GET)$/;

  const parts = line.split(
    /(\s+|"[^"]*"|\bHTTPClient\.METHOD_POST\b|\bHTTPClient\.METHOD_GET\b|\bextends\b|\bclass_name\b|\bconst\b|\bfunc\b|\bvar\b|\breturn\b|\bif\b|\bawait\b|\btrue\b|\bfalse\b|\bnull\b|\b@export\b|\b\d+\b)/g
  );

  return parts.map((part, index) => {
    if (part === "") {
      return null;
    }

    if (/^\s+$/.test(part)) {
      return <span key={index}>{part}</span>;
    }

    if (decoratorPattern.test(part)) {
      return (
        <span key={index} style={{ color: "#ffb732" }}>
          {part}
        </span>
      );
    }

    if (keywordPattern.test(part)) {
      return (
        <span key={index} style={{ color: "#eb7676" }}>
          {part}
        </span>
      );
    }

    if (boolNullPattern.test(part)) {
      return (
        <span key={index} style={{ color: "#eb7676" }}>
          {part}
        </span>
      );
    }

    if (methodPattern.test(part)) {
      return (
        <span key={index} style={{ color: "#93c5fd" }}>
          {part}
        </span>
      );
    }

    if (/^"[^"]*"$/.test(part)) {
      return (
        <span key={index} style={{ color: "#e4ef86" }}>
          {part}
        </span>
      );
    }

    if (/^\d+$/.test(part)) {
      return (
        <span key={index} style={{ color: "#a5d5fc" }}>
          {part}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function Page() {
  const { t } = useLang();
  const { isMobile, isTablet } = useViewport();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMsg("");
    setIsError(false);
  }, [mode]);

  const title = useMemo(() => {
    if (mode === "register") {
      return t("createYourAccount");
    }

    return t("welcomeBack");
  }, [mode, t]);

  const subtitle = useMemo(() => {
    if (mode === "register") {
      return t("subtitleRegister");
    }

    return t("subtitleLogin");
  }, [mode, t]);

  const godotCode = `extends Node
class_name ScoreforgeClient

@export var base_url: String = "https://scoreforge-phi.vercel.app"
@export var api_key: String = "YOUR_API_KEY_HERE"
@export var project_id: int = 1

func submit_score(username: String, value: int, metadata: Dictionary = {}) -> Dictionary:
\tif api_key.strip_edges() == "":
\t\treturn {
\t\t\t"ok": false,
\t\t\t"error": "Missing api_key"
\t\t}

\tif project_id <= 0:
\t\treturn {
\t\t\t"ok": false,
\t\t\t"error": "Missing project_id"
\t\t}

\tvar url = "%s/scores/submit" % base_url
\tvar headers = PackedStringArray([
\t\t"Accept: application/json",
\t\t"Content-Type: application/json",
\t\t"X-API-Key: %s" % api_key
\t])

\tvar body = {
\t\t"project_id": project_id,
\t\t"username": username,
\t\t"value": value,
\t\t"metadata": metadata
\t}

\treturn await _request_json(url, HTTPClient.METHOD_POST, headers, body)

func get_leaderboard(limit: int = 20) -> Dictionary:
\tif project_id <= 0:
\t\treturn {
\t\t\t"ok": false,
\t\t\t"error": "Missing project_id"
\t\t}

\tvar url = "%s/scores/leaderboard/%d?limit=%d" % [base_url, project_id, limit]
\tvar headers = PackedStringArray([
\t\t"Accept: application/json"
\t])

\treturn await _request_json(url, HTTPClient.METHOD_GET, headers, null)

func _request_json(url: String, method: int, headers: PackedStringArray, body: Variant) -> Dictionary:
\tvar http = HTTPRequest.new()
\tadd_child(http)

\tvar body_text = ""
\tif body != null:
\t\tbody_text = JSON.stringify(body)

\tvar err = http.request(url, headers, method, body_text)
\tif err != OK:
\t\thttp.queue_free()
\t\treturn {
\t\t\t"ok": false,
\t\t\t"status": 0,
\t\t\t"error": "Request error: %s" % str(err)
\t\t}

\tvar response = await http.request_completed
\thttp.queue_free()

\tvar result = response[0]
\tvar status = response[1]
\tvar raw_body: PackedByteArray = response[3]
\tvar text = raw_body.get_string_from_utf8()

\tif result != HTTPRequest.RESULT_SUCCESS:
\t\treturn {
\t\t\t"ok": false,
\t\t\t"status": status,
\t\t\t"error": "HTTP request failed",
\t\t\t"raw": text
\t\t}

\tif text.strip_edges() == "":
\t\treturn {
\t\t\t"ok": status >= 200 and status < 300,
\t\t\t"status": status,
\t\t\t"data": null
\t\t}

\tvar data = JSON.parse_string(text)
\tif data == null:
\t\treturn {
\t\t\t"ok": false,
\t\t\t"status": status,
\t\t\t"error": "Invalid JSON response",
\t\t\t"raw": text
\t\t}

\tif status < 200 or status >= 300:
\t\treturn {
\t\t\t"ok": false,
\t\t\t"status": status,
\t\t\t"error": "HTTP error",
\t\t\t"data": data
\t\t}

\treturn {
\t\t"ok": true,
\t\t"status": status,
\t\t"data": data
\t}`;
  
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(godotCode);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      setCopied(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: isMobile ? "18px 12px 40px" : "36px 20px 56px",
      color: "var(--text)"
    },
    shell: {
      width: "100%",
      maxWidth: "1200px",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: isMobile ? "18px" : "30px",
      alignItems: "stretch"
    },
    heroGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1.12fr 0.88fr",
      gap: isMobile ? "18px" : "30px",
      alignItems: "stretch"
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: isMobile ? "2px 0" : "16px 8px",
      order: isMobile ? 2 : 1
    },
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      maxWidth: "100%",
      padding: isMobile ? "7px 10px" : "8px 12px",
      borderRadius: "999px",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      color: "var(--text-soft)",
      fontSize: isMobile ? "11px" : "13px",
      fontWeight: 700,
      letterSpacing: "0.02em",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      boxShadow: "0 8px 22px rgba(15,23,42,0.05)"
    },
    heroTitle: {
      margin: "16px 0 12px 0",
      fontSize: isMobile ? "31px" : isTablet ? "44px" : "56px",
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      color: "var(--text)",
      fontWeight: 900,
      maxWidth: isMobile ? "100%" : "620px"
    },
    heroText: {
      margin: 0,
      maxWidth: isMobile ? "100%" : "680px",
      color: "var(--text-soft)",
      fontSize: isMobile ? "14px" : "18px",
      lineHeight: isMobile ? 1.65 : 1.75
    },
    ctaRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: isMobile ? "18px" : "22px"
    },
    secondaryCta: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: isMobile ? "100%" : "auto",
      minWidth: isMobile ? "0" : "170px",
      padding: isMobile ? "12px 14px" : "12px 18px",
      borderRadius: "14px",
      border: "1px solid var(--border)",
      background: "var(--surface-soft)",
      color: "var(--text)",
      fontWeight: 700,
      textDecoration: "none",
      transition: "all 0.2s ease",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)"
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, minmax(0, 1fr))",
      gap: "14px",
      marginTop: isMobile ? "18px" : "30px"
    },
    featureCard: {
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: isMobile ? "18px" : "20px",
      padding: isMobile ? "16px" : "18px",
      boxShadow:
        "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(18px) saturate(145%)",
      WebkitBackdropFilter: "blur(18px) saturate(145%)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease"
    },
    featureTitle: {
      margin: 0,
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: 800,
      color: "var(--text)"
    },
    featureText: {
      marginTop: "8px",
      marginBottom: 0,
      color: "var(--text-soft)",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: 1.6
    },
    authWrap: {
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      order: isMobile ? 1 : 2
    },
    authCard: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "470px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: isMobile ? "22px" : "30px",
      padding: isMobile ? "16px" : "28px",
      boxShadow: "var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(28px) saturate(155%)",
      WebkitBackdropFilter: "blur(28px) saturate(155%)",
      position: "relative",
      overflow: "hidden"
    },
    authCardGlow: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 42%, rgba(124,92,255,0.06) 100%)"
    },
    authInner: {
      position: "relative",
      zIndex: 1
    },
    authHeader: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "10px",
      justifyContent: "space-between",
      marginBottom: "18px"
    },
    tabs: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      width: "100%",
      padding: "5px",
      borderRadius: "14px",
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      gap: "6px",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)"
    },
    tabButton: {
      minWidth: "0",
      border: "none",
      background: "transparent",
      color: "var(--text-muted)",
      padding: isMobile ? "10px 8px" : "10px 16px",
      borderRadius: "10px",
      fontWeight: 700,
      fontSize: isMobile ? "13px" : "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      whiteSpace: "nowrap"
    },
    tabButtonActive: {
      background: "rgba(255,255,255,0.72)",
      color: "var(--text)",
      boxShadow: "0 6px 20px rgba(15,23,42,0.08)"
    },
    dashboardLink: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: isMobile ? "100%" : "150px",
      minWidth: isMobile ? "0" : "150px",
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
      WebkitBackdropFilter: "blur(12px)"
    },
    authTitle: {
      margin: 0,
      fontSize: isMobile ? "23px" : "30px",
      lineHeight: 1.08,
      fontWeight: 900,
      color: "var(--text)",
      letterSpacing: "-0.03em"
    },
    authSubtitle: {
      marginTop: "8px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.65,
      fontSize: isMobile ? "13px" : "15px"
    },
    form: {
      marginTop: "20px",
      display: "grid",
      gap: "14px"
    },
    field: {
      display: "grid",
      gap: "7px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 700,
      color: "var(--text-soft)"
    },
    input: {
      width: "100%",
      borderRadius: "14px",
      border: "1px solid rgba(15, 23, 42, 0.45)",
      background: "var(--surface-soft)",
      color: "var(--text)",
      padding: isMobile ? "13px 14px" : "14px 16px",
      fontSize: "15px",
      outline: "none",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 1px 2px rgba(15,23,42,0.02)",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)"
    },
    inputFocus: {
      border: "1px solid rgba(37,99,235,0.85)",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
      background: "var(--surface-strong)"
    },
    submitButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: isMobile ? "100%" : "170px",
      minWidth: isMobile ? "0" : "170px",
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
      whiteSpace: "nowrap"
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
      WebkitBackdropFilter: "blur(10px)"
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
      WebkitBackdropFilter: "blur(10px)"
    },
    tutorialSection: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: isMobile ? "22px" : "30px",
      padding: isMobile ? "16px" : "30px",
      boxShadow: "var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(22px) saturate(150%)",
      WebkitBackdropFilter: "blur(22px) saturate(150%)"
    },
    tutorialTitle: {
      margin: 0,
      fontSize: isMobile ? "24px" : "36px",
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color: "var(--text)",
      lineHeight: 1.08
    },
    tutorialSubtitle: {
      marginTop: "10px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.7,
      maxWidth: "820px",
      fontSize: isMobile ? "14px" : "15px"
    },
    tutorialGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "12px",
      marginTop: "18px"
    },
    tutorialCard: {
      background: "var(--surface-soft)",
      border: "1px solid var(--border)",
      borderRadius: "18px",
      padding: isMobile ? "15px" : "18px",
      boxShadow:
        "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.18)",
      backdropFilter: "blur(18px) saturate(145%)",
      WebkitBackdropFilter: "blur(18px) saturate(145%)"
    },
    tutorialCardTitle: {
      margin: 0,
      fontSize: isMobile ? "15px" : "17px",
      fontWeight: 800,
      color: "var(--text)",
      lineHeight: 1.4
    },
    tutorialCardText: {
      marginTop: "8px",
      marginBottom: 0,
      color: "var(--text-soft)",
      lineHeight: 1.65,
      fontSize: isMobile ? "13px" : "14px"
    },
    codeWrap: {
      marginTop: "18px",
      background: "rgba(9, 14, 30, 0.96)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "18px",
      padding: isMobile ? "12px" : "20px",
      overflow: "hidden",
      boxShadow: "0 18px 40px rgba(0,0,0,0.22)"
    },
    codeTopBar: {
      display: "flex",
      alignItems: isMobile ? "stretch" : "center",
      justifyContent: "space-between",
      gap: "12px",
      flexDirection: isMobile ? "column" : "row",
      marginBottom: "12px"
    },
    codeTitleWrap: {
      display: "grid",
      gap: "6px",
      minWidth: 0
    },
    codeTitle: {
      margin: 0,
      color: "#e5edff",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: 800
    },
    codeHint: {
      margin: 0,
      color: "#aeb9d6",
      lineHeight: 1.55,
      fontSize: isMobile ? "12px" : "14px"
    },
    copyButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: isMobile ? "100%" : "140px",
      minWidth: isMobile ? "0" : "140px",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "12px",
      background: copied ? "rgba(34,197,94,0.22)" : "rgba(255,255,255,0.08)",
      color: "#f8fafc",
      padding: "10px 14px",
      fontWeight: 700,
      fontSize: isMobile ? "13px" : "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap"
    },
    editorHeader: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      gap: "10px",
      justifyContent: "space-between",
      padding: isMobile ? "10px 12px" : "12px 14px",
      borderRadius: "14px 14px 0 0",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderBottom: "none",
      flexDirection: isMobile ? "column" : "row",
      flexWrap: "wrap"
    },
    editorDots: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    editorDotRed: {
      width: "10px",
      height: "10px",
      borderRadius: "999px",
      background: "#fb7185",
      display: "inline-block"
    },
    editorDotYellow: {
      width: "10px",
      height: "10px",
      borderRadius: "999px",
      background: "#fbbf24",
      display: "inline-block"
    },
    editorDotGreen: {
      width: "10px",
      height: "10px",
      borderRadius: "999px",
      background: "#4ade80",
      display: "inline-block"
    },
    editorFile: {
      color: "#e5edff",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 700,
      flex: 1,
      minWidth: 0,
      wordBreak: "break-word"
    },
    editorBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 10px",
      borderRadius: "999px",
      background: "rgba(96,165,250,0.16)",
      border: "1px solid rgba(96,165,250,0.22)",
      color: "#bfdbfe",
      fontSize: "12px",
      fontWeight: 700,
      maxWidth: "100%"
    },
    codeBody: {
      border: "1px solid rgba(255,255,255,0.08)",
      borderTop: "none",
      borderRadius: "0 0 14px 14px",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch"
    },
    codeLine: {
      display: "grid",
      gridTemplateColumns: isMobile ? "42px minmax(0, 1fr)" : "56px minmax(0, 1fr)",
      alignItems: "start"
    },
    codeLineNumber: {
      color: "#64748b",
      textAlign: "right",
      padding: isMobile ? "0 10px 0 0" : "0 14px 0 0",
      userSelect: "none",
      fontFamily: "Consolas, Monaco, monospace",
      fontSize: isMobile ? "11px" : "13px",
      lineHeight: 1.7,
      borderRight: "1px solid rgba(255,255,255,0.06)"
    },
    codeLineText: {
      padding: isMobile ? "0 0 0 10px" : "0 0 0 14px",
      color: "#f8fafc",
      fontSize: isMobile ? "11px" : "13px",
      lineHeight: 1.7,
      fontFamily: "Consolas, Monaco, monospace",
      whiteSpace: "pre",
      minWidth: "max-content"
    }
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
      setMsg(t("missingApiBase"));
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const response = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(asMessage(data.detail) || t("registerFailed"));
        }

        setMsg(t("accountCreated"));
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
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(asMessage(data.detail) || t("loginFailed"));
      }

      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg(err?.message || t("somethingWentWrong"));
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.heroGrid}>
          <section style={styles.hero}>
            <span style={styles.eyebrow}>{t("eyebrow")}</span>

            <h1 style={styles.heroTitle}>{t("heroTitle")}</h1>

            <p style={styles.heroText}>{t("heroText")}</p>

            <div style={styles.ctaRow}>
              <a href="#tutorial" style={styles.secondaryCta}>
                {t("howToImplement")}
              </a>
            </div>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>{t("featureProjectTitle")}</p>
                <p style={styles.featureText}>{t("featureProjectText")}</p>
              </div>

              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>{t("featureApiTitle")}</p>
                <p style={styles.featureText}>{t("featureApiText")}</p>
              </div>

              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>{t("featureFastTitle")}</p>
                <p style={styles.featureText}>{t("featureFastText")}</p>
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
                    >
                      {t("login")}
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
                    >
                      {t("register")}
                    </button>
                  </div>

                  <a href="/dashboard" style={styles.dashboardLink}>
                    {t("dashboard")}
                  </a>
                </div>

                <div>
                  <h2 style={styles.authTitle}>{title}</h2>
                  <p style={styles.authSubtitle}>{subtitle}</p>
                </div>

                <form onSubmit={submit} style={styles.form}>
                  <div style={styles.field}>
                    <label htmlFor="username" style={styles.label}>
                      {t("username")}
                    </label>
                    <input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField("")}
                      required
                      placeholder={t("enterUsername")}
                      autoComplete="username"
                      style={getInputStyle("username")}
                    />
                  </div>

                  {mode === "register" ? (
                    <div style={styles.field}>
                      <label htmlFor="email" style={styles.label}>
                        {t("email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        required
                        placeholder={t("enterEmail")}
                        autoComplete="email"
                        style={getInputStyle("email")}
                      />
                    </div>
                  ) : null}

                  <div style={styles.field}>
                    <label htmlFor="password" style={styles.label}>
                      {t("password")}
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      required
                      placeholder={t("enterPassword")}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      style={getInputStyle("password")}
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                    {isSubmitting
                      ? mode === "register"
                        ? t("creatingAccount")
                        : t("loggingIn")
                      : mode === "register"
                        ? t("createAccount")
                        : t("login")}
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
        </section>

        <section id="tutorial" style={styles.tutorialSection}>
          <h2 style={styles.tutorialTitle}>{t("tutorialSectionTitle")}</h2>
          <p style={styles.tutorialSubtitle}>{t("tutorialSectionSubtitle")}</p>

          <div style={styles.tutorialGrid}>
            <div style={styles.tutorialCard}>
              <p style={styles.tutorialCardTitle}>{t("tutorialStep1Title")}</p>
              <p style={styles.tutorialCardText}>{t("tutorialStep1Text")}</p>
            </div>

            <div style={styles.tutorialCard}>
              <p style={styles.tutorialCardTitle}>{t("tutorialStep2Title")}</p>
              <p style={styles.tutorialCardText}>{t("tutorialStep2Text")}</p>
            </div>

            <div style={styles.tutorialCard}>
              <p style={styles.tutorialCardTitle}>{t("tutorialStep3Title")}</p>
              <p style={styles.tutorialCardText}>{t("tutorialStep3Text")}</p>
            </div>

            <div style={styles.tutorialCard}>
              <p style={styles.tutorialCardTitle}>{t("tutorialExtraTitle")}</p>
              <p style={styles.tutorialCardText}>{t("tutorialExtraText")}</p>
            </div>
          </div>

          <div style={styles.tutorialGrid}>
            <div style={styles.tutorialCard}>
              <p style={styles.tutorialCardTitle}>{t("tutorialSubmitTitle")}</p>
              <p style={styles.tutorialCardText}>{t("tutorialSubmitText")}</p>
            </div>

            <div style={styles.tutorialCard}>
              <p style={styles.tutorialCardTitle}>{t("tutorialLeaderboardTitle")}</p>
              <p style={styles.tutorialCardText}>{t("tutorialLeaderboardText")}</p>
            </div>
          </div>

          <div style={styles.codeWrap}>
            <div style={styles.codeTopBar}>
              <div style={styles.codeTitleWrap}>
                <p style={styles.codeTitle}>{t("tutorialCodeTitle")}</p>
                <p style={styles.codeHint}>{t("tutorialCodeHint")}</p>
              </div>

              <button type="button" style={styles.copyButton} onClick={copyCode}>
                {copied ? t("copiedCode") : t("copyCode")}
              </button>
            </div>

            <div style={styles.editorHeader}>
              <div style={styles.editorDots}>
                <span style={styles.editorDotRed} />
                <span style={styles.editorDotYellow} />
                <span style={styles.editorDotGreen} />
              </div>

              <div style={styles.editorFile}>{t("tutorialCodeFile")}</div>

              <div style={styles.editorBadge}>{t("tutorialCodeBadge")}</div>
            </div>

            <div style={styles.codeBody}>
              {godotCode.split("\n").map((line, index) => (
                <div key={index} style={styles.codeLine}>
                  <span style={styles.codeLineNumber}>{index + 1}</span>
                  <span style={styles.codeLineText}>{renderHighlightedLine(line)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}