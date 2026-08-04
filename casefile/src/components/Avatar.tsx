import Image from "next/image";
import { site } from "@/lib/config";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Avatar() {
  if (site.avatar) {
    return (
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-line sm:h-32 sm:w-32">
        <Image
          src={site.avatar}
          alt={site.name}
          width={128}
          height={128}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    );
  }

  // No photo configured yet — a styled placeholder rather than a broken
  // image or empty gap. Set site.avatar in src/lib/config.ts to replace it.
  return (
    <div
      className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line bg-panel/40 sm:h-32 sm:w-32"
      title="Add a photo: set site.avatar in src/lib/config.ts"
    >
      <span className="font-display text-2xl font-semibold text-stamp sm:text-3xl">
        {getInitials(site.name)}
      </span>
      <span className="font-display text-[9px] uppercase tracking-[0.1em] text-muted-2">
        Photo
      </span>
    </div>
  );
}
