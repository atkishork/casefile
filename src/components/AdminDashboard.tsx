"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Loader2, AlertTriangle, Pencil } from "lucide-react";
import { padCase, padNote } from "@/lib/format";

export type DashboardContentType = "writeup" | "note";

export interface DashboardItem {
  slug: string;
  title: string;
  draft: boolean;
  number: number; // caseNumber or noteNumber
  metaLine: string; // pre-formatted secondary line (category · ctf · date, or just date)
  tags: string[];
  category?: string; // writeup-only, powers the category breakdown chips
  status?: "solved" | "wip"; // writeup-only, powers the Solved/In-progress stats
}

interface Labels {
  itemNoun: string; // "case" | "note"
  itemNounPlural: string; // "cases" | "notes"
  listTitle: string; // "All case files" | "All notes"
  newHref: string;
  newLabel: string;
  editHrefBase: string; // "/admin/edit" | "/admin/notes/edit"
  deleteEndpointBase: string; // "/api/writeups" | "/api/notes"
}

const LABELS: Record<DashboardContentType, Labels> = {
  writeup: {
    itemNoun: "case",
    itemNounPlural: "cases",
    listTitle: "All case files",
    newHref: "/admin/new",
    newLabel: "New case file",
    editHrefBase: "/admin/edit",
    deleteEndpointBase: "/api/writeups",
  },
  note: {
    itemNoun: "note",
    itemNounPlural: "notes",
    listTitle: "All field notes",
    newHref: "/admin/notes/new",
    newLabel: "New note",
    editHrefBase: "/admin/notes/edit",
    deleteEndpointBase: "/api/notes",
  },
};

export default function AdminDashboard({
  contentType,
  initialItems,
}: {
  contentType: DashboardContentType;
  initialItems: DashboardItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const labels = LABELS[contentType];
  const pad = contentType === "writeup" ? padCase : padNote;

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    let solved = 0;
    let wip = 0;
    let drafts = 0;
    const tags = new Set<string>();

    for (const item of items) {
      if (item.category) byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
      if (item.status === "solved") solved++;
      else if (item.status === "wip") wip++;
      if (item.draft) drafts++;
      item.tags.forEach((t) => tags.add(t));
    }

    return {
      total: items.length,
      solved,
      wip,
      drafts,
      categories: Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
      tagCount: tags.size,
    };
  }, [items]);

  function handleDeleted(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  const showWriteupStats = contentType === "writeup";

  return (
    <div className="mt-8">
      {/* Stats */}
      <dl className={`grid grid-cols-2 gap-4 ${showWriteupStats ? "sm:grid-cols-4" : "sm:grid-cols-2"}`}>
        <StatCard label={`Total ${labels.itemNounPlural}`} value={stats.total} />
        {showWriteupStats && (
          <>
            <StatCard label="Solved" value={stats.solved} />
            <StatCard label="In progress" value={stats.wip} />
          </>
        )}
        <StatCard label="Drafts" value={stats.drafts} />
      </dl>

      {showWriteupStats && stats.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.categories.map(([cat, count]) => (
            <span
              key={cat}
              className="rounded-sm border border-line px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.1em] text-muted"
            >
              {cat} <span className="text-stamp-bright">{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* New item CTA */}
      <Link
        href={labels.newHref}
        className="mt-8 inline-flex items-center gap-2 rounded bg-stamp px-4 py-2.5 font-display text-xs uppercase tracking-[0.12em] text-paper transition-all duration-150 hover:bg-stamp-bright active:scale-[0.98]"
      >
        <Plus size={14} /> {labels.newLabel}
      </Link>

      {/* List */}
      <div className="mt-10">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          {labels.listTitle}
        </h2>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Nothing published yet — start with &quot;{labels.newLabel}&quot; above.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-line border-t border-line">
            {items.map((item) => (
              <ItemRow key={item.slug} item={item} labels={labels} pad={pad} onDeleted={handleDeleted} />
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

function ItemRow({
  item,
  labels,
  pad,
  onDeleted,
}: {
  item: DashboardItem;
  labels: Labels;
  pad: (n: number) => string;
  onDeleted: (slug: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${labels.deleteEndpointBase}/${item.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete.");
        setDeleting(false);
        return;
      }
      onDeleted(item.slug);
    } catch {
      setError("Network error.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-xs text-stamp">{pad(item.number)}</span>
          <span className="truncate font-display text-sm text-paper">{item.title}</span>
          {item.draft && (
            <span className="rounded-sm border border-stamp px-1.5 py-0.5 font-display text-[9px] uppercase tracking-wide text-stamp-bright">
              Draft
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-2">{item.metaLine}</p>
        {error && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-stamp-bright">
            <AlertTriangle size={12} /> {error}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`${labels.editHrefBase}/${item.slug}`}
          className="inline-flex items-center gap-1.5 rounded border border-line px-2.5 py-1.5 font-display text-[10px] uppercase tracking-wide text-muted transition-colors hover:border-stamp-dim hover:text-paper"
        >
          <Pencil size={12} /> {item.draft ? "Resume" : "Edit"}
        </Link>
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
