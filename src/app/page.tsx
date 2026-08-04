import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getAllWriteups } from "@/lib/writeups";
import { getAllNotes } from "@/lib/notes";
import { site, about } from "@/lib/config";
import { padCase, formatDate } from "@/lib/format";
import CaseCard from "@/components/CaseCard";
import NoteCard from "@/components/NoteCard";

export default function Home() {
  const writeups = getAllWriteups();
  const notes = getAllNotes();
  const solvedCount = writeups.filter((w) => w.status === "solved").length;
  const categories = Array.from(new Set(writeups.map((w) => w.category)));
  const latest = writeups[0];

  const tagCounts = new Map<string, number>();
  writeups.forEach((w) => w.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));
  const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="grain-bg border-b border-line">
        <div className="mx-auto max-w-5xl animate-fade-in-up px-5 py-16 sm:px-8 sm:py-24">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
            Open case log · {writeups.length.toString().padStart(2, "0")} files
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-paper sm:text-5xl">
            {site.name}
          </h1>
          <p className="mt-3 font-display text-sm uppercase tracking-[0.1em] text-muted sm:text-base">
            {site.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {site.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/writeups"
              className="inline-flex items-center gap-2 rounded bg-stamp px-4 py-2.5 font-display text-xs uppercase tracking-[0.12em] text-paper transition-all duration-150 hover:bg-stamp-bright active:scale-[0.97]"
            >
              Browse the case log <ArrowRight size={14} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded border border-line px-4 py-2.5 font-display text-xs uppercase tracking-[0.12em] text-muted transition-all duration-150 hover:border-stamp-dim hover:text-paper active:scale-[0.97]"
            >
              Read the dossier <ArrowDown size={14} />
            </Link>
          </div>

          {/* Ledger strip — real numbers, not decoration */}
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
            <div>
              <dt className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
                Cases solved
              </dt>
              <dd className="mt-1 font-display text-2xl text-paper">{solvedCount}</dd>
            </div>
            <div>
              <dt className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
                Categories
              </dt>
              <dd className="mt-1 font-display text-2xl text-paper">{categories.length}</dd>
            </div>
            <div>
              <dt className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
                Latest entry
              </dt>
              <dd className="mt-1 font-display text-2xl text-paper">
                {latest ? padCase(latest.caseNumber) : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
                Filed
              </dt>
              <dd className="mt-1 font-display text-2xl text-paper">
                {latest ? formatDate(latest.date) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Recent case log                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-paper">
            Recent case log
          </h2>
          <Link
            href="/writeups"
            className="font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
          >
            View all →
          </Link>
        </div>

        {writeups.length === 0 ? (
          <div className="mt-8 rounded border border-dashed border-line p-8 text-center text-sm text-muted">
            No case files yet. Drop a markdown file in{" "}
            <code className="rounded bg-panel px-1.5 py-0.5 font-code text-xs">
              content/writeups/
            </code>{" "}
            to open your first case.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {writeups.slice(0, 4).map((w, i) => (
              <CaseCard key={w.slug} writeup={w} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Recent field notes                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-paper">
              Recent field notes
            </h2>
            <Link
              href="/notes"
              className="font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
            >
              View all →
            </Link>
          </div>

          {notes.length === 0 ? (
            <div className="mt-8 rounded border border-dashed border-line p-8 text-center text-sm text-muted">
              No notes yet. Drop a markdown file in{" "}
              <code className="rounded bg-panel px-1.5 py-0.5 font-code text-xs">
                content/notes/
              </code>{" "}
              or use <code className="rounded bg-panel px-1.5 py-0.5 font-code text-xs">/admin/notes/new</code>.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {notes.slice(0, 4).map((n, i) => (
                <NoteCard key={n.slug} note={n} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Browse by tag                                                     */}
      {/* ---------------------------------------------------------------- */}
      {sortedTags.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-paper">
              Browse by tag
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {sortedTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/writeups?tag=${encodeURIComponent(tag)}`}
                  className="rounded-sm border border-line px-3 py-1.5 font-display text-xs text-muted transition-all duration-150 hover:border-stamp-dim hover:text-paper active:scale-[0.97]"
                >
                  #{tag} <span className="text-stamp-bright">({count})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Dossier teaser                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-paper">
            Skills &amp; focus areas
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {about.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-sm border border-line px-2.5 py-1 text-sm text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.12em] text-paper hover:text-stamp-bright"
          >
            Full dossier & background <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
