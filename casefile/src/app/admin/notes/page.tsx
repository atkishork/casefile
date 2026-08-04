import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import AdminDashboard, { type DashboardItem } from "@/components/AdminDashboard";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Field Notes",
  robots: { index: false, follow: false },
};

export default function AdminNotesPage() {
  const notes = getAllNotes({ includeDrafts: true });

  const items: DashboardItem[] = notes.map((n) => ({
    slug: n.slug,
    title: n.title,
    draft: n.draft,
    number: n.noteNumber,
    metaLine: n.date,
    tags: n.tags,
  }));

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
            Private — not linked anywhere on the site
          </p>
          <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
            Admin dashboard
          </h1>
          <div className="mt-3 flex gap-2">
            <Link
              href="/admin"
              className="rounded-sm border border-line px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.1em] text-muted hover:border-stamp-dim hover:text-paper"
            >
              Case Files
            </Link>
            <span className="rounded-sm border border-stamp bg-stamp/15 px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.1em] text-stamp-bright">
              Field Notes
            </span>
          </div>
        </div>
        <LogoutButton />
      </div>
      <AdminDashboard contentType="note" initialItems={items} />
    </div>
  );
}
