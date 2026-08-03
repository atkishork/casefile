import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Writeup, WriteupFrontmatter, Category } from "./types";

const WRITEUPS_DIR = path.join(process.cwd(), "content", "writeups");

function readSlugs(): string[] {
  if (!fs.existsSync(WRITEUPS_DIR)) return [];
  return fs
    .readdirSync(WRITEUPS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Reads every markdown file in content/writeups, parses frontmatter,
 * assigns sequential case numbers in chronological order (oldest = CASE-001),
 * and returns them sorted newest-first for display.
 *
 * Drafts (frontmatter `draft: true`) are excluded by default — every public
 * page (home, case log, tag cloud, sitemap, generateStaticParams) uses that
 * default, so a draft has no live URL until it's published. Pass
 * `includeDrafts: true` for admin-only views that need to see everything.
 * Case numbers are computed only over the returned (visible) set, so drafts
 * never create gaps in the public numbering.
 */
export function getAllWriteups(options?: { includeDrafts?: boolean }): Writeup[] {
  const slugs = readSlugs();

  const parsed = slugs.map((slug) => {
    const fullPath = path.join(WRITEUPS_DIR, `${slug}.md`);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as WriteupFrontmatter;

    return {
      ...fm,
      slug,
      content,
      draft: Boolean(fm.draft),
      readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    };
  });

  const visible = options?.includeDrafts ? parsed : parsed.filter((w) => !w.draft);

  // Chronological (oldest first) to assign stable, ever-increasing case numbers.
  const chronological = [...visible].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const withCaseNumbers: Writeup[] = chronological.map((w, i) => ({
    ...w,
    caseNumber: i + 1,
  }));

  // Newest first for display.
  return withCaseNumbers.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getWriteupBySlug(
  slug: string,
  options?: { includeDrafts?: boolean }
): Writeup | undefined {
  return getAllWriteups(options).find((w) => w.slug === slug);
}

export function getAllCategories(): Category[] {
  const set = new Set<Category>();
  getAllWriteups().forEach((w) => set.add(w.category));
  return Array.from(set);
}

export function getAdjacentWriteups(slug: string): {
  prev: Writeup | null;
  next: Writeup | null;
} {
  const all = getAllWriteups(); // newest first
  const idx = all.findIndex((w) => w.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    // "next" chronologically (newer) is the previous item in this newest-first array
    next: idx > 0 ? all[idx - 1] : null,
    prev: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
