import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getAllWriteups } from "@/lib/writeups";
import { getAllNotes } from "@/lib/notes";
import { siteUrl } from "@/lib/format";

// Served automatically at /sitemap.xml — this file coexists fine with
// src/app/sitemap/page.tsx (the human-readable /sitemap page); they're
// different route names ("sitemap.ts" vs the "sitemap" folder).

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl(site.domain);
  const writeups = getAllWriteups();
  const notes = getAllNotes();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/writeups`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/notes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/sitemap`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/disclaimer`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const writeupRoutes: MetadataRoute.Sitemap = writeups.map((w) => ({
    url: `${base}/writeups/${w.slug}`,
    lastModified: w.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const noteRoutes: MetadataRoute.Sitemap = notes.map((n) => ({
    url: `${base}/notes/${n.slug}`,
    lastModified: n.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...writeupRoutes, ...noteRoutes];
}
