"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/config";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/writeups", label: "Case Log" },
  { href: "/notes", label: "Field Notes" },
  { href: "/about", label: "Dossier" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu when the route changes — adjusted during render
  // (React's recommended pattern for this) rather than in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock background scroll while the mobile overlay is open.
  useEffect(() => {
    if (open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-[0.15em] text-paper"
        >
          {site.brand}
          <span className="text-stamp">_</span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
            >
              {l.label}
            </Link>
          ))}
          {site.socials.github && (
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded border border-line px-3 py-1.5 font-display text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:border-stamp hover:text-paper"
            >
              GitHub ↗
            </a>
          )}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center text-paper"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu
              size={22}
              className={`absolute transition-all duration-200 ease-out ${
                open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              size={22}
              className={`absolute transition-all duration-200 ease-out ${
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Fixed overlay (not a sticky-header descendant) so it isn't affected
          by iOS Safari's sticky + backdrop-filter child-paint quirks.
          Always mounted so both the open AND close transitions animate —
          a conditionally-rendered element only ever animates mounting in. */}
      <div
        id="mobile-nav-panel"
        aria-hidden={!open}
        className={`fixed inset-x-0 top-16 z-50 origin-top border-b border-line bg-ink px-5 pb-6 pt-3 shadow-xl transition-all duration-300 ease-out sm:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className="rounded px-3 py-3 font-display text-sm uppercase tracking-wide text-muted transition-colors hover:bg-panel hover:text-paper"
            >
              {l.label}
            </Link>
          ))}
          {site.socials.github && (
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              tabIndex={open ? 0 : -1}
              className="rounded px-3 py-3 font-display text-sm uppercase tracking-wide text-muted transition-colors hover:bg-panel hover:text-paper"
            >
              GitHub ↗
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
