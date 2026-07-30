import Link from "next/link";
import type { Writeup } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { padCase, formatDate } from "@/lib/format";
import { StampBadge, DifficultyMeter, StatusMark } from "./Meta";

export default function CaseCard({
  writeup,
  index = 0,
}: {
  writeup: Writeup;
  /** Optional position in a grid — used only to stagger the entrance animation. */
  index?: number;
}) {
  return (
    <Link
      href={`/writeups/${writeup.slug}`}
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
      className="group block animate-fade-in-up rounded-md border border-line bg-panel/40 p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-stamp-dim hover:shadow-lg active:translate-y-0 active:scale-[0.99] focus-visible:border-stamp-dim sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-xs tracking-[0.12em] text-stamp">
          {padCase(writeup.caseNumber)}
        </span>
        <span className="font-display text-[11px] tracking-[0.1em] text-muted-2">
          {formatDate(writeup.date)}
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-lg font-semibold text-paper transition-colors group-hover:text-stamp-bright sm:text-xl">
        {writeup.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="font-display text-[11px] uppercase tracking-[0.1em] text-muted">
          {writeup.ctf}
        </span>
        <StampBadge>{CATEGORY_LABELS[writeup.category]}</StampBadge>
        <DifficultyMeter level={writeup.difficulty} />
        <StatusMark status={writeup.status} />
        <span className="font-display text-[11px] text-muted-2">
          {writeup.readingMinutes} min read
        </span>
      </div>

      {/* Redaction-reveal excerpt: covered by a bar on hover-capable devices,
          plain text on touch devices (max-sm) where hover doesn't apply. */}
      <div className="relative mt-4 overflow-hidden rounded border border-line">
        <p className="p-4 text-sm leading-relaxed text-muted">{writeup.summary}</p>
        <div
          aria-hidden="true"
          className="redact-texture absolute inset-0 origin-left transition-transform duration-500 ease-out max-sm:hidden group-hover:scale-x-0 group-focus-visible:scale-x-0"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {writeup.tags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="font-display text-[10px] uppercase tracking-[0.08em] text-muted-2"
          >
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}
