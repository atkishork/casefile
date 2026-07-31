import type { Metadata } from "next";
import { getAllWriteups } from "@/lib/writeups";
import AdminDashboard from "@/components/AdminDashboard";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  // Snapshot as of the last deploy — same "commits now, visible after the
  // next redeploy" model as publishing. Deletes remove the underlying file
  // from GitHub immediately; the dashboard's own list updates instantly via
  // local state (see AdminDashboard), independent of the redeploy cycle.
  const writeups = getAllWriteups();

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
        </div>
        <LogoutButton />
      </div>
      <AdminDashboard initialWriteups={writeups} />
    </div>
  );
}
