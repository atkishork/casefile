export type Category = "web" | "pwn" | "crypto" | "rev" | "forensics" | "misc" | "osint";

export type Difficulty = "easy" | "medium" | "hard" | "insane";

export type Status = "solved" | "wip";

export interface WriteupFrontmatter {
  title: string;
  date: string;
  ctf: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  status: Status;
  /** Unpublished — hidden from all public pages until set to false. Optional; absent/undefined is treated as false. */
  draft?: boolean;
}

export interface Writeup extends WriteupFrontmatter {
  slug: string;
  caseNumber: number;
  readingMinutes: number;
  content: string; // raw markdown
  /** Normalized from the optional frontmatter field — always a real boolean here. */
  draft: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  web: "Web",
  pwn: "Pwn",
  crypto: "Crypto",
  rev: "Reversing",
  forensics: "Forensics",
  misc: "Misc",
  osint: "OSINT",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  insane: "Insane",
};

export interface Tool {
  name: string;
  /** Optional path to a logo in /public (e.g. "/tools/burpsuite.png"). Falls back to a monogram box if omitted. */
  icon?: string;
  /** Proficiency, shown as a 5-star rating. */
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  /** Optional link to a certificate — PDF, image, or a verification page (e.g. Credly). */
  certificateUrl?: string;
}

// ---------------------------------------------------------------------------
// Field Notes — blog posts / written notes. Simpler than a Writeup: no CTF
// category, difficulty, or solved/wip status, just title/date/tags/summary.
// ---------------------------------------------------------------------------

export interface NoteFrontmatter {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  draft?: boolean;
}

export interface Note extends NoteFrontmatter {
  slug: string;
  noteNumber: number;
  readingMinutes: number;
  content: string;
  draft: boolean;
}
