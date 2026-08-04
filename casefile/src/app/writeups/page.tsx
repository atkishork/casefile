import type { Metadata } from "next";
import { getAllWriteups, getAllCategories } from "@/lib/writeups";
import { site } from "@/lib/config";
import WriteupsExplorer from "@/components/WriteupsExplorer";

export const metadata: Metadata = {
  title: `Case Log — ${site.brand}`,
  description: "Every CTF writeup, filed by category.",
};

export default async function WriteupsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const writeups = getAllWriteups();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Case log
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-paper sm:text-4xl">
        Every case, filed.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
        {writeups.length} write-up{writeups.length === 1 ? "" : "s"} across{" "}
        {categories.length} categor{categories.length === 1 ? "y" : "ies"}. Filter below.
      </p>

      <div className="mt-10">
        <WriteupsExplorer writeups={writeups} categories={categories} initialTag={tag} />
      </div>
    </div>
  );
}
