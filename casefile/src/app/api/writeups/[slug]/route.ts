import { NextResponse } from "next/server";
import { deleteFile, deleteDirectory } from "@/lib/github";

// Sits behind proxy.ts (session check) — see src/proxy.ts matcher.

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  try {
    await deleteFile(`content/writeups/${slug}.md`, `Delete writeup: ${slug}`);
    // Best-effort — most writeups have an image folder, some don't.
    await deleteDirectory(`public/writeups/${slug}`, `Delete images for writeup: ${slug}`);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error deleting writeup.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
