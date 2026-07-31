"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { Writeup } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { padCase, formatDate } from "@/lib/format";

export default function AdminDashboard({ initialWriteups }: { initialWriteups: Writeup[] }) {
  const [writeups, setWriteups] = useState(initialWriteups);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    let solved = 0;
    let wip = 0;
    const tags = new Set<string>();

    for (const w of writeups) {
      byCategory[w.category] = (byCategory[w.category] ?? 0) + 1;
      if (w.status === "solved") solved++;
      else wip++;
      w.tags.forEach((t) => tags.add(t));
    }

    return {
      total: writeups.length,
      solved,
      wip,
      categories: Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
      tagCount: tags.size,
    };
  }, [writeups]);

  function handleDeleted(slug: string) {
    setWriteups((prev) => prev.filter((w) => w.slug !== slug));
  }

  return (
    <div className="mt-8">
      {/* Stats */}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total cases" value={stats.total} />
        <StatCard label="Solved" value={stats.solved} />
        <StatCard label="In progress" value={stats.wip} />
        <StatCard label="Tags used" value={stats.tagCount} />
      </dl>

      {stats.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.categories.map(([cat, count]) => (
            <span
              key={cat}
              className="rounded-sm border border-line px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.1em] text-muted"
            >
              {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}{" "}
              <span className="text-stamp-bright">{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* New case file CTA */}
      <Link
        href="/admin/new"
        className="mt-8 inline-flex items-center gap-2 rounded bg-stamp px-4 py-2.5 font-display text-xs uppercase tracking-[0.12em] text-paper transition-all duration-150 hover:bg-stamp-bright active:scale-[0.98]"
      >
        <Plus size={14} /> New case file
      </Link>

      {/* Writeup list */}
      <div className="mt-10">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          All case files
        </h2>
        {writeups.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Nothing published yet — start with &quot;New case file&quot; above.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-line border-t border-line">
            {writeups.map((w) => (
              <WriteupRow key={w.slug} writeup={w} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-2">
          Deleting removes the file from GitHub immediately and disappears from
          this list right away. The live site catches up after your host&apos;s
          next redeploy (~1–2 min) — if you refresh this page before then,
          a just-deleted entry may briefly reappear here since it reflects
          the last completed deploy.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-panel/40 p-4">
      <dt className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl text-paper">{value}</dd>
    </div>
  );
}

function WriteupRow({
  writeup,
  onDeleted,
}: {
  writeup: Writeup;
  onDeleted: (slug: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/writeups/${writeup.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete.");
        setDeleting(false);
        return;
      }
      onDeleted(writeup.slug);
    } catch {
      setError("Network error.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xs text-stamp">{padCase(writeup.caseNumber)}</span>
          <span className="truncate font-display text-sm text-paper">{writeup.title}</span>
        </div>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-2">
          {CATEGORY_LABELS[writeup.category]} · {writeup.ctf} · {formatDate(writeup.date)}
        </p>
        {error && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-stamp-bright">
            <AlertTriangle size={12} /> {error}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {confirming ? (
          <>
            <span className="text-xs text-muted">Delete permanently?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 rounded border border-stamp px-2.5 py-1 font-display text-[10px] uppercase tracking-wide text-stamp-bright hover:bg-stamp/15 disabled:opacity-50"
            >
              {deleting ? <Loader2 size={11} className="animate-spin" /> : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="rounded border border-line px-2.5 py-1 font-display text-[10px] uppercase tracking-wide text-muted hover:text-paper"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 rounded border border-line px-2.5 py-1.5 font-display text-[10px] uppercase tracking-wide text-muted transition-colors hover:border-stamp-dim hover:text-stamp-bright"
          >
            <Trash2 size={12} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
