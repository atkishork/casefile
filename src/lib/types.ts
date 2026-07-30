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
}

export interface Writeup extends WriteupFrontmatter {
  slug: string;
  caseNumber: number;
  readingMinutes: number;
  content: string; // raw markdown
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
