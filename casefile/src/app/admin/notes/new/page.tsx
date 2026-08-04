import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminEditor from "@/components/AdminEditor";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Write a note",
  robots: { index: false, follow: false },
};

export default function AdminNotesNewPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/notes"
            className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
          >
            <ArrowLeft size={13} /> Dashboard
          </Link>
          <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
            Write a note
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Fill this in, drop in any images, and hit publish — it commits
            straight to your GitHub repo, which redeploys automatically.
          </p>
        </div>
        <LogoutButton />
      </div>
      <AdminEditor contentType="note" />
    </div>
  );
}
