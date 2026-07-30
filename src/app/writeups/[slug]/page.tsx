import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllWriteups, getWriteupBySlug, getAdjacentWriteups } from "@/lib/writeups";
import { markdownToHtml } from "@/lib/markdown";
import { CATEGORY_LABELS } from "@/lib/types";
import { padCase, formatDate } from "@/lib/format";
import { StampBadge, DifficultyMeter, StatusMark } from "@/components/Meta";
import { site } from "@/lib/config";

export function generateStaticParams() {
  return getAllWriteups().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writeup = getWriteupBySlug(slug);
  if (!writeup) return {};
  return {
    title: `${writeup.title} — ${site.brand}`,
    description: writeup.summary,
  };
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getWriteupBySlug(slug);
  if (!writeup) notFound();

  const html = await markdownToHtml(writeup.content);
  const { prev, next } = getAdjacentWriteups(slug);

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link
        href="/writeups"
        className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
      >
        <ArrowLeft size={13} /> Back to case log
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs tracking-[0.12em] text-stamp">
            {padCase(writeup.caseNumber)}
          </span>
          <span className="font-display text-[11px] tracking-[0.1em] text-muted-2">
            {formatDate(writeup.date)}
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">
          {writeup.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-display text-[11px] uppercase tracking-[0.1em] text-muted">
            {writeup.ctf}
          </span>
          <StampBadge>{CATEGORY_LABELS[writeup.category]}</StampBadge>
          <DifficultyMeter level={writeup.difficulty} />
          <StatusMark status={writeup.status} />
          <span className="font-display text-[11px] text-muted-2">
            {writeup.readingMinutes} min read
          </span>
        </div>

        {writeup.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {writeup.tags.map((t) => (
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

      <div
        className="prose-case mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/writeups/${prev.slug}`}
            className="group rounded border border-line p-4 transition-colors hover:border-stamp-dim"
          >
            <span className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.1em] text-muted-2">
              <ArrowLeft size={12} /> Previous case
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
            href={`/writeups/${next.slug}`}
            className="group rounded border border-line p-4 text-right transition-colors hover:border-stamp-dim sm:text-right"
          >
            <span className="flex items-center justify-end gap-1.5 font-display text-[10px] uppercase tracking-[0.1em] text-muted-2">
              Next case <ArrowRight size={12} />
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
  );
}
