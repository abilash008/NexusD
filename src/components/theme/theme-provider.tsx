"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Read saved preference
    const saved = localStorage.getItem("nexusd_theme") as Theme | null;
    const initialTheme: Theme = saved && ["system", "light", "dark"].includes(saved) ? saved : "system";
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // System theme change listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = localStorage.getItem("nexusd_theme") as Theme | null;
      if (!current || current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement;
    let effective: "light" | "dark" = "light";

    if (targetTheme === "dark") {
      effective = "dark";
    } else if (targetTheme === "light") {
      effective = "light";
    } else {
      effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    if (effective === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    setResolvedTheme(effective);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("nexusd_theme", newTheme);
    } catch (e) {}
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
