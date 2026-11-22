import { createContext, useContext, useEffect, useState, useCallback } from "react";

const THEME_KEY = "jandrishti-theme";

const ThemeContext = createContext(null);

/**
 * Returns the initial theme: saved preference > system preference > light.
 */
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Applies the theme to the <html> element and the theme-color meta tag.
 */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.removeAttribute("data-theme");
    root.classList.remove("dark");
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#070d0a" : "#16845b");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // localStorage unavailable (e.g. private mode) — silently ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Apply theme attribute + meta color whenever theme changes.
  // The early inline script in index.html already set the attribute on first
  // paint, so this is idempotent on mount (no flash of the wrong theme).
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Keep theme in sync across tabs/windows.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === THEME_KEY && event.newValue) {
        setThemeState(event.newValue);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
