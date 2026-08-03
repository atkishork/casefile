import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getAllWriteups } from "@/lib/writeups";
import { siteUrl } from "@/lib/format";

// Served automatically at /sitemap.xml — this file coexists fine with
// src/app/sitemap/page.tsx (the human-readable /sitemap page); they're
// different route names ("sitemap.ts" vs the "sitemap" folder).

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl(site.domain);
  const writeups = getAllWriteups();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/writeups`, changeFrequency: "weekly", priority: 0.9 },
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

  return [...staticRoutes, ...writeupRoutes];
}
