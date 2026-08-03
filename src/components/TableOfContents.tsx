import type { TocItem } from "@/lib/markdown";

function TocLinks({ items }: { items: TocItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
          <a
            href={`#${item.id}`}
            className="block text-sm text-muted transition-colors hover:text-stamp-bright"
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Sticky sidebar — place in a wide-enough desktop layout slot. */
export function TocSidebar({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block">
      <p className="font-display text-[11px] uppercase tracking-[0.1em] text-muted-2">
        On this page
      </p>
      <nav aria-label="Table of contents" className="mt-3 border-l border-line pl-4">
        <TocLinks items={items} />
      </nav>
    </aside>
  );
}

/** Collapsible, native <details> — place inline within the article on mobile. */
export function TocMobile({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  return (
    <details className="mb-8 rounded border border-line lg:hidden">
      <summary className="cursor-pointer select-none px-4 py-3 font-display text-xs uppercase tracking-[0.1em] text-muted">
        On this page
      </summary>
      <nav aria-label="Table of contents" className="border-t border-line px-4 py-3">
        <TocLinks items={items} />
      </nav>
    </details>
  );
}
