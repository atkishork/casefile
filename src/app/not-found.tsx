import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-5 py-24 sm:px-8">
      <span className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Error 404
      </span>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
        Case file not found.
      </h1>
      <p className="mt-3 text-sm text-muted sm:text-base">
        This entry doesn&apos;t exist in the log — it may have been moved, or the case
        number was never filed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded bg-stamp px-4 py-2.5 font-display text-xs uppercase tracking-[0.12em] text-paper hover:bg-stamp-bright"
      >
        Return to base
      </Link>
    </div>
  );
}
