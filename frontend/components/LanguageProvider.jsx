"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = window.localStorage.getItem("scoreforge-lang");

    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    setMounted(true);
  }, []);

  function changeLang(nextLang) {
    if (!translations[nextLang]) {
      return;
    }

    setLang(nextLang);
    window.localStorage.setItem("scoreforge-lang", nextLang);
  }

  function t(key) {
    return translations[lang]?.[key] || key;
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        changeLang,
        t,
        mounted
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLang must be used inside LanguageProvider");
  }

  return context;
}