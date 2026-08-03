export function padCase(n: number): string {
  return `CASE-${String(n).padStart(3, "0")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Resolves site.domain (from src/lib/config.ts) into a proper absolute
 * URL, falling back to a clearly-fake placeholder while it's still unset.
 * Used for the sitemap and for metadataBase (which OG image resolution
 * needs to build correct absolute image URLs).
 */
export function siteUrl(domain: string): string {
  const trimmed = domain?.trim();
  if (!trimmed || trimmed.includes("example.com")) {
    return "https://your-domain-here.com";
  }
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}
