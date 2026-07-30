import type { Metadata } from "next";
import AdminEditor from "@/components/AdminEditor";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Write a case file",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
            Private — not linked anywhere on the site
          </p>
          <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
            Write a case file
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Fill this in, drop in any screenshots, and hit publish — it commits
            straight to your GitHub repo, which redeploys automatically.
          </p>
        </div>
        <LogoutButton />
      </div>
      <AdminEditor />
    </div>
  );
}
