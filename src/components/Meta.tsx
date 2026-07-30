import type { Difficulty } from "@/lib/types";

export function StampBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-line px-1.5 py-0.5 font-display text-[10px] uppercase tracking-[0.12em] text-muted">
      {children}
    </span>
  );
}

const LEVELS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  insane: 4,
};

export function DifficultyMeter({ level }: { level: Difficulty }) {
  const filled = LEVELS[level];
  return (
    <span
      className="inline-flex items-center gap-0.5"
      title={`Difficulty: ${level}`}
      aria-label={`Difficulty: ${level}`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-1 rounded-[1px] ${
            i < filled ? "bg-stamp-bright" : "bg-line"
          }`}
        />
      ))}
    </span>
  );
}

export function StatusMark({ status }: { status: "solved" | "wip" }) {
  if (status === "solved") {
    return (
      <span className="inline-flex items-center gap-1 font-display text-[10px] uppercase tracking-[0.12em] text-stamp-bright">
        <span className="h-1.5 w-1.5 rounded-full bg-stamp-bright" />
        Solved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-display text-[10px] uppercase tracking-[0.12em] text-muted-2">
      <span className="h-1.5 w-1.5 rounded-full border border-muted-2" />
      In progress
    </span>
  );
}
