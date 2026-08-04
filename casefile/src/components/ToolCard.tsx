import Image from "next/image";
import type { Tool } from "@/lib/types";
import StarRating from "./StarRating";

function getMonogram(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-panel/40 p-3">
      {tool.icon ? (
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded border border-line bg-panel">
          <Image
            src={tool.icon}
            alt={tool.name}
            width={36}
            height={36}
            className="h-full w-full object-contain p-1"
          />
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-dashed border-line bg-panel font-display text-[10px] font-semibold text-stamp">
          {getMonogram(tool.name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-display text-xs text-paper">{tool.name}</p>
        <div className="mt-0.5">
          <StarRating rating={tool.rating} />
        </div>
      </div>
    </div>
  );
}
