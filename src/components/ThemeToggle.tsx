"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "sst-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

function applyTheme(theme: Theme) {
  const systemDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    if (theme === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = getInitialTheme();
      setTheme(current);
      applyTheme(current);
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return (
    <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white p-1 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`rounded px-2 py-1 ${
          theme === "light"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`rounded px-2 py-1 ${
          theme === "dark"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
        }`}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`rounded px-2 py-1 ${
          theme === "system"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
        }`}
      >
        System
      </button>
    </div>
  );
}

