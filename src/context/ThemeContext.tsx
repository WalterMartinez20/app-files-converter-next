"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_CHANGE_EVENT = "app-theme-change";

function applyTheme(newTheme: Theme) {
  const root = document.documentElement;
  if (newTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Cambia el tema de forma sincronizada: todos los elementos cambian a la vez.
 * - Desactiva las transiciones individuales (clase `theme-switching`) para que
 *   ningún elemento se adelante o atrase respecto a los demás.
 * - Si el navegador soporta View Transitions, hace un único fundido global.
 */
function switchThemeSynchronized(commit: () => void) {
  const root = document.documentElement;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const run = () => {
    root.classList.add("theme-switching");
    commit();
  };
  const done = () => root.classList.remove("theme-switching");

  if (typeof doc.startViewTransition === "function" && !reduceMotion) {
    const transition = doc.startViewTransition(run);
    transition.finished.then(done, done);
  } else {
    run();
    // Forzar reflow y quitar la clase tras pintar, para que el cambio sea simultáneo
    void root.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(done));
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getThemeSnapshot(): Theme {
  try {
    const storedTheme = localStorage.getItem("app_theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {
    // Ignore storage errors
  }
  return "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    switchThemeSynchronized(() => {
      try {
        localStorage.setItem("app_theme", newTheme);
      } catch {
        // Ignore storage errors
      }
      applyTheme(newTheme);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    });
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
