"use client";

import { useMemo, useState } from "react";
import type { Writeup, Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import CaseCard from "./CaseCard";

export default function WriteupsExplorer({
  writeups,
  categories,
}: {
  writeups: Writeup[];
  categories: Category[];
}) {
  const [active, setActive] = useState<Category | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? writeups : writeups.filter((w) => w.category === active)),
    [writeups, active]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <FilterButton active={active === "all"} onClick={() => setActive("all")}>
          All ({writeups.length})
        </FilterButton>
        {categories.map((c) => {
          const count = writeups.filter((w) => w.category === c).length;
          return (
            <FilterButton key={c} active={active === c} onClick={() => setActive(c)}>
              {CATEGORY_LABELS[c]} ({count})
            </FilterButton>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded border border-dashed border-line p-8 text-center text-sm text-muted">
          No case files in this category yet.
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
