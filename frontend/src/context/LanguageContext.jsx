import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("ksp_platform_language");
      return saved === "KN" ? "KN" : "EN";
    } catch (e) {
      return "EN";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ksp_platform_language", lang);
    } catch (e) {
      console.warn("Failed saving language preference:", e);
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "EN" ? "KN" : "EN"));
  };

  /**
   * Helper function to translate a key
   */
  const t = (key, fallback = "") => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations.EN && translations.EN[key]) {
      return translations.EN[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
