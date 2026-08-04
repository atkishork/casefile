"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Note } from "@/lib/types";
import NoteCard from "./NoteCard";

export default function NotesExplorer({
  notes,
  initialTag,
}: {
  notes: Note[];
  initialTag?: string;
}) {
  const [tag, setTag] = useState<string | null>(initialTag ?? null);

  const filtered = useMemo(
    () => (tag ? notes.filter((n) => n.tags.includes(tag)) : notes),
    [notes, tag]
  );

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    notes.forEach((n) => n.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  return (
    <div>
      {tag ? (
        <div className="mb-3 flex items-center gap-2">
          <span className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
            Filtering by tag:
          </span>
          <button
            type="button"
            onClick={() => setTag(null)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-stamp bg-stamp/15 px-2.5 py-1 font-display text-xs text-stamp-bright transition-all duration-150 active:scale-[0.96]"
          >
            #{tag} <X size={12} />
          </button>
        </div>
      ) : (
        allTags.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
            {allTags.map(([t, count]) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className="rounded-sm border border-line px-3 py-1.5 font-display text-xs text-muted transition-all duration-150 hover:border-stamp-dim hover:text-paper active:scale-[0.96]"
              >
                #{t} <span className="text-stamp-bright">({count})</span>
              </button>
            ))}
          </div>
        )
      )}

      {filtered.length === 0 ? (
        <div className="mt-8 rounded border border-dashed border-line p-8 text-center text-sm text-muted">
          No notes {tag ? "with this tag" : "yet"}.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {filtered.map((n, i) => (
            <NoteCard key={n.slug} note={n} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
