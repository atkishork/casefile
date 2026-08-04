import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { getAllWriteups } from "@/lib/writeups";
import { getAllNotes } from "@/lib/notes";
import { CATEGORY_LABELS } from "@/lib/types";
import { padCase, padNote } from "@/lib/format";

export const metadata: Metadata = {
  title: `Sitemap — ${site.brand}`,
  description: "Every page on this site, in one place.",
};

export default function SitemapPage() {
  const writeups = getAllWriteups();
  const notes = getAllNotes();

  const pages = [
    { href: "/", label: "Home" },
    { href: "/writeups", label: "Case Log" },
    { href: "/notes", label: "Field Notes" },
    { href: "/about", label: "Dossier" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Index
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-4xl">
        Sitemap
      </h1>
      <p className="mt-2 text-sm text-muted">
        Every page on the site. A machine-readable version also lives at{" "}
        <code className="font-code text-xs">/sitemap.xml</code>.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          Pages
        </h2>
        <ul className="mt-3 divide-y divide-line border-t border-line">
          {pages.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="block py-3 text-sm text-muted transition-colors hover:text-stamp-bright"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {writeups.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
            Case log ({writeups.length})
          </h2>
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {writeups.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/writeups/${w.slug}`}
                  className="flex items-baseline justify-between gap-3 py-3 text-sm text-muted transition-colors hover:text-stamp-bright"
                >
                  <span className="truncate">{w.title}</span>
                  <span className="shrink-0 font-code text-xs text-muted-2">
                    {padCase(w.caseNumber)} · {CATEGORY_LABELS[w.category]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {notes.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
            Field notes ({notes.length})
          </h2>
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {notes.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/notes/${n.slug}`}
                  className="flex items-baseline justify-between gap-3 py-3 text-sm text-muted transition-colors hover:text-stamp-bright"
                >
                  <span className="truncate">{n.title}</span>
                  <span className="shrink-0 font-code text-xs text-muted-2">
                    {padNote(n.noteNumber)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
