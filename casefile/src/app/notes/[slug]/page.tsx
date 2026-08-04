import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllNotes, getNoteBySlug, getAdjacentNotes } from "@/lib/notes";
import { markdownToHtml } from "@/lib/markdown";
import { padNote, formatDate } from "@/lib/format";
import { TocSidebar, TocMobile } from "@/components/TableOfContents";
import { site } from "@/lib/config";

export function generateStaticParams() {
  return getAllNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: `${note.title} — ${site.brand}`,
    description: note.summary,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const { html, toc } = await markdownToHtml(note.content);
  const { prev, next } = getAdjacentNotes(slug);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20 lg:grid lg:grid-cols-[1fr_220px] lg:items-start lg:gap-12">
      <article className="max-w-3xl">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
        >
          <ArrowLeft size={13} /> Back to field notes
        </Link>

        <header className="mt-6 border-b border-line pb-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs tracking-[0.12em] text-stamp">
              {padNote(note.noteNumber)}
            </span>
            <span className="font-display text-[11px] tracking-[0.1em] text-muted-2">
              {formatDate(note.date)}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">
            {note.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-display text-[11px] text-muted-2">
              {note.readingMinutes} min read
            </span>
          </div>

          {note.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((t) => (
                <span
                  key={t}
                  className="font-display text-[10px] uppercase tracking-[0.08em] text-muted-2"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="mt-8">
          <TocMobile items={toc} />
        </div>

        <div
          className="prose-case max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/notes/${prev.slug}`}
              className="group rounded border border-line p-4 transition-colors hover:border-stamp-dim"
            >
              <span className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.1em] text-muted-2">
                <ArrowLeft size={12} /> Previous note
              </span>
              <span className="mt-1 block font-display text-sm text-paper group-hover:text-stamp-bright">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/notes/${next.slug}`}
              className="group rounded border border-line p-4 text-right transition-colors hover:border-stamp-dim sm:text-right"
            >
              <span className="flex items-center justify-end gap-1.5 font-display text-[10px] uppercase tracking-[0.1em] text-muted-2">
                Next note <ArrowRight size={12} />
              </span>
              <span className="mt-1 block font-display text-sm text-paper group-hover:text-stamp-bright">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>

      <TocSidebar items={toc} />
    </div>
  );
}
