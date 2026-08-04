import { NextResponse } from "next/server";
import { putFile } from "@/lib/github";
import type { Category, Difficulty, Status } from "@/lib/types";

// This route sits behind proxy.ts (session check) — do not remove that
// protection, since this endpoint can write to your GitHub repo. Handles
// both writeups and notes, distinguished by `contentType`.

type ContentType = "writeup" | "note";

interface PublishImage {
  filename: string;
  base64: string; // raw base64, no "data:image/png;base64," prefix
}

interface PublishBody {
  contentType: ContentType;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  summary: string;
  content: string; // markdown body (no frontmatter)
  slug?: string; // optional override; derived from title if omitted
  images?: PublishImage[];
  draft?: boolean;
  // Writeup-only fields.
  ctf?: string;
  category?: Category;
  difficulty?: Difficulty;
  status?: Status;
}

const VALID_CATEGORIES: Category[] = ["web", "pwn", "crypto", "rev", "forensics", "misc", "osint"];
const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "insane"];
const VALID_STATUSES: Status[] = ["solved", "wip"];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeYamlString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildMarkdownFile(body: PublishBody, tags: string[]): string {
  const tagsYaml = `[${tags.map((t) => `"${escapeYamlString(t)}"`).join(", ")}]`;

  if (body.contentType === "writeup") {
    return `---
title: "${escapeYamlString(body.title)}"
date: "${body.date}"
ctf: "${escapeYamlString(body.ctf ?? "")}"
category: ${body.category}
difficulty: ${body.difficulty}
tags: ${tagsYaml}
summary: "${escapeYamlString(body.summary)}"
status: ${body.status}
draft: ${body.draft ? "true" : "false"}
---

${body.content}
`;
  }

  return `---
title: "${escapeYamlString(body.title)}"
date: "${body.date}"
tags: ${tagsYaml}
summary: "${escapeYamlString(body.summary)}"
draft: ${body.draft ? "true" : "false"}
---

${body.content}
`;
}

export async function POST(req: Request) {
  let body: PublishBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.contentType !== "writeup" && body.contentType !== "note") {
    return NextResponse.json({ error: "Missing or invalid contentType." }, { status: 400 });
  }
  const isWriteup = body.contentType === "writeup";

  // --- Validation -----------------------------------------------------
  const required: (keyof PublishBody)[] = ["title", "date", "summary", "content"];
  if (isWriteup) required.push("ctf", "category", "difficulty", "status");

  for (const field of required) {
    const value = body[field];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }
  if (isWriteup) {
    if (!VALID_CATEGORIES.includes(body.category as Category)) {
      return NextResponse.json({ error: `Invalid category: ${body.category}` }, { status: 400 });
    }
    if (!VALID_DIFFICULTIES.includes(body.difficulty as Difficulty)) {
      return NextResponse.json({ error: `Invalid difficulty: ${body.difficulty}` }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(body.status as Status)) {
      return NextResponse.json({ error: `Invalid status: ${body.status}` }, { status: 400 });
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return NextResponse.json({ error: "date must be in YYYY-MM-DD format." }, { status: 400 });
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return NextResponse.json({ error: "Could not derive a slug from the title." }, { status: 400 });
  }

  const tags = Array.isArray(body.tags) ? body.tags.filter(Boolean) : [];
  const contentDir = isWriteup ? "writeups" : "notes";
  const label = isWriteup ? "writeup" : "note";

  try {
    // 1. Commit the markdown file.
    const markdown = buildMarkdownFile(body, tags);
    await putFile(
      `content/${contentDir}/${slug}.md`,
      Buffer.from(markdown, "utf8").toString("base64"),
      `${body.draft ? "Save draft" : "Publish"} ${label}: ${body.title}`
    );

    // 2. Commit any images alongside it.
    const images = body.images ?? [];
    for (const img of images) {
      if (!img.filename || !img.base64) continue;
      const safeFilename = img.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      await putFile(
        `public/${contentDir}/${slug}/${safeFilename}`,
        img.base64,
        `Add image for ${label}: ${body.title} (${safeFilename})`
      );
    }

    return NextResponse.json({
      ok: true,
      slug,
      url: `/${contentDir}/${slug}`,
      draft: Boolean(body.draft),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : `Unknown error publishing ${label}.`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
