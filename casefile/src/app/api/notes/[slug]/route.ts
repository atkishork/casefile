import { NextResponse } from "next/server";
import { deleteFile, deleteDirectory } from "@/lib/github";

// Sits behind proxy.ts (session check) — see src/proxy.ts matcher.

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  try {
    await deleteFile(`content/notes/${slug}.md`, `Delete note: ${slug}`);
    await deleteDirectory(`public/notes/${slug}`, `Delete images for note: ${slug}`);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error deleting note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
