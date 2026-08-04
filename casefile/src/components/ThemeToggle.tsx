"use client";

import { Sun, Moon } from "lucide-react";

/**
 * Stateless by design: reads/writes the DOM attribute directly instead of
 * mirroring it into React state. That sidesteps any server/client mismatch
 * (the DOM attribute is already set correctly pre-hydration by the inline
 * script in layout.tsx) — which icon is visible is handled entirely by the
 * CSS below, driven by the live `data-theme` attribute on <html>.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      window.localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      window.localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={`relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded border border-line text-muted transition-all duration-150 hover:border-stamp-dim hover:text-paper active:scale-[0.94] ${className}`}
    >
      <Moon
        size={15}
        className="absolute transition-all duration-300 ease-out [html[data-theme=light]_&]:-rotate-90 [html[data-theme=light]_&]:scale-50 [html[data-theme=light]_&]:opacity-0"
      />
      <Sun
        size={15}
        className="absolute rotate-90 scale-50 opacity-0 transition-all duration-300 ease-out [html[data-theme=light]_&]:rotate-0 [html[data-theme=light]_&]:scale-100 [html[data-theme=light]_&]:opacity-100"
      />
    </button>
  );
}
