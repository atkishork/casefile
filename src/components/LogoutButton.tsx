"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin-logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted transition-all duration-150 hover:border-stamp-dim hover:text-paper active:scale-[0.97] disabled:opacity-50"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
      Log out
    </button>
  );
}
