import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getWriteupBySlug } from "@/lib/writeups";
import AdminEditor from "@/components/AdminEditor";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Edit case file",
  robots: { index: false, follow: false },
};

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // includeDrafts so this also works for resuming a saved draft.
  const writeup = getWriteupBySlug(slug, { includeDrafts: true });
  if (!writeup) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
          >
            <ArrowLeft size={13} /> Dashboard
          </Link>
          <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
            {writeup.draft ? "Resume draft" : "Edit case file"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Changes save back to the same file — this updates the existing
            commit rather than creating a new one.
          </p>
        </div>
        <LogoutButton />
      </div>
      <AdminEditor
        contentType="writeup"
        initial={{
          slug: writeup.slug,
          title: writeup.title,
          date: writeup.date,
          ctf: writeup.ctf,
          category: writeup.category,
          difficulty: writeup.difficulty,
          tags: writeup.tags,
          summary: writeup.summary,
          status: writeup.status,
          draft: writeup.draft,
          content: writeup.content,
        }}
      />
    </div>
  );
}
