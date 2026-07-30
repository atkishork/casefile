"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded border border-line bg-panel px-3 py-2.5 text-sm text-text placeholder:text-muted-2 focus:border-stamp-dim focus:outline-none";
const labelClass = "font-display text-[11px] uppercase tracking-[0.1em] text-muted";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className={labelClass}>Username</label>
        <input
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded border border-line p-3 text-sm text-stamp-bright">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !username || !password}
        className="inline-flex w-full items-center justify-center gap-2 rounded bg-stamp px-4 py-2.5 font-display text-xs uppercase tracking-[0.12em] text-paper transition-all duration-150 hover:bg-stamp-bright active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Logging in…
          </>
        ) : (
          "Log in"
        )}
      </button>
    </form>
  );
}
