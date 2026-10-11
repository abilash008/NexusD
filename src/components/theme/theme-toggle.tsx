"use client";

import React from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  isExpanded?: boolean;
}

export function ThemeToggle({ isExpanded = true }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (!isExpanded) {
    // Collapsed icon rail mode: single cycle button
    const cycleTheme = () => {
      if (theme === "system") setTheme("light");
      else if (theme === "light") setTheme("dark");
      else setTheme("system");
    };

    return (
      <div className="relative group flex justify-center py-1">
        <button
          type="button"
          onClick={cycleTheme}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        >
          {theme === "system" ? (
            <Monitor className="h-4 w-4" />
          ) : resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-blue-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </button>

        {/* Tooltip for collapsed sidebar */}
        <div className="hidden lg:block absolute left-[62px] px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
          Theme: {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
        </div>
      </div>
    );
  }

  // Expanded mode: Segmented control right above sign-in options, aligned to the right
  return (
    <div className="flex items-center justify-between py-1 px-1">
      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
        Theme
      </span>
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
        {/* System Button */}
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`h-6 w-6 flex items-center justify-center rounded-md transition-all cursor-pointer ${
            theme === "system"
              ? "bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="System Theme"
          aria-label="System Theme"
        >
          <Monitor className="h-3.5 w-3.5" />
        </button>

        {/* Light Button */}
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`h-6 w-6 flex items-center justify-center rounded-md transition-all cursor-pointer ${
            theme === "light"
              ? "bg-white dark:bg-slate-700 text-amber-500 shadow-xs font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="Light Mode"
          aria-label="Light Mode"
        >
          <Sun className="h-3.5 w-3.5" />
        </button>

        {/* Dark Button */}
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`h-6 w-6 flex items-center justify-center rounded-md transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-white dark:bg-slate-700 text-blue-400 shadow-xs font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="Dark Mode"
          aria-label="Dark Mode"
        >
          <Moon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
