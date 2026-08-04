import Link from "next/link";
import type { Note } from "@/lib/types";
import { padNote, formatDate } from "@/lib/format";

export default function NoteCard({ note, index = 0 }: { note: Note; index?: number }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
      className="group block animate-fade-in-up rounded-md border border-line bg-panel/40 p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-stamp-dim hover:shadow-lg active:translate-y-0 active:scale-[0.99] focus-visible:border-stamp-dim sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-xs tracking-[0.12em] text-stamp">
          {padNote(note.noteNumber)}
        </span>
        <span className="font-display text-[11px] tracking-[0.1em] text-muted-2">
          {formatDate(note.date)}
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-lg font-semibold text-paper transition-colors group-hover:text-stamp-bright sm:text-xl">
        {note.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted">{note.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="font-display text-[11px] text-muted-2">{note.readingMinutes} min read</span>
        {note.tags.slice(0, 4).map((t) => (
          <span key={t} className="font-display text-[10px] uppercase tracking-[0.08em] text-muted-2">
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}
