import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Note, NoteFrontmatter } from "./types";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

function readSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Same shape and draft-handling as getAllWriteups() in writeups.ts — see
 * that file for the full explanation. Numbers here use a separate NOTE-###
 * sequence, independent of writeups' CASE-### numbering.
 */
export function getAllNotes(options?: { includeDrafts?: boolean }): Note[] {
  const slugs = readSlugs();

  const parsed = slugs.map((slug) => {
    const fullPath = path.join(NOTES_DIR, `${slug}.md`);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as NoteFrontmatter;

    return {
      ...fm,
      slug,
      content,
      draft: Boolean(fm.draft),
      readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    };
  });

  const visible = options?.includeDrafts ? parsed : parsed.filter((n) => !n.draft);

  const chronological = [...visible].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const withNumbers: Note[] = chronological.map((n, i) => ({
    ...n,
    noteNumber: i + 1,
  }));

  return withNumbers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteBySlug(slug: string, options?: { includeDrafts?: boolean }): Note | undefined {
  return getAllNotes(options).find((n) => n.slug === slug);
}

export function getAdjacentNotes(slug: string): { prev: Note | null; next: Note | null } {
  const all = getAllNotes();
  const idx = all.findIndex((n) => n.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? all[idx - 1] : null,
    prev: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
