import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes";
import { site } from "@/lib/config";
import NotesExplorer from "@/components/NotesExplorer";

export const metadata: Metadata = {
  title: `Field Notes — ${site.brand}`,
  description: "Blog posts and written notes, outside the CTF case log.",
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const notes = getAllNotes();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Field notes
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-4xl">
        Notes &amp; write-ups from outside the case log.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
        {notes.length} note{notes.length === 1 ? "" : "s"} — separate from the CTF case log,
        for everything else worth writing down.
      </p>

      <div className="mt-10">
        <NotesExplorer notes={notes} initialTag={tag} />
      </div>
    </div>
  );
}
