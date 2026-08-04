"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Writeup, Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import CaseCard from "./CaseCard";

export default function WriteupsExplorer({
  writeups,
  categories,
  initialTag,
}: {
  writeups: Writeup[];
  categories: Category[];
  initialTag?: string;
}) {
  const [active, setActive] = useState<Category | "all">("all");
  const [tag, setTag] = useState<string | null>(initialTag ?? null);

  const filtered = useMemo(() => {
    if (tag) return writeups.filter((w) => w.tags.includes(tag));
    return active === "all" ? writeups : writeups.filter((w) => w.category === active);
  }, [writeups, active, tag]);

  function selectCategory(c: Category | "all") {
    setTag(null); // category and tag filters are mutually exclusive
    setActive(c);
  }

  return (
    <div>
      {tag && (
        <div className="mb-3 flex items-center gap-2">
          <span className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
            Filtering by tag:
          </span>
          <button
            type="button"
            onClick={() => setTag(null)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-stamp bg-stamp/15 px-2.5 py-1 font-display text-xs text-stamp-bright transition-all duration-150 active:scale-[0.96]"
          >
            #{tag} <X size={12} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <FilterButton active={!tag && active === "all"} onClick={() => selectCategory("all")}>
          All ({writeups.length})
        </FilterButton>
        {categories.map((c) => {
          const count = writeups.filter((w) => w.category === c).length;
          return (
            <FilterButton key={c} active={!tag && active === c} onClick={() => selectCategory(c)}>
              {CATEGORY_LABELS[c]} ({count})
            </FilterButton>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded border border-dashed border-line p-8 text-center text-sm text-muted">
          No case files {tag ? "with this tag" : "in this category"} yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {filtered.map((w, i) => (
            <CaseCard key={w.slug} writeup={w} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-sm border px-3 py-1.5 font-display text-xs uppercase tracking-[0.1em] transition-all duration-150 active:scale-[0.96] ${
        active
          ? "border-stamp bg-stamp/15 text-stamp-bright"
          : "border-line text-muted hover:border-stamp-dim hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}
