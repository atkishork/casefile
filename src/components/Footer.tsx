import Link from "next/link";
import { site } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { label: "GitHub", href: site.socials.github },
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "Medium", href: site.socials.medium },
    { label: "Twitter", href: site.socials.twitter },
    { label: "Email", href: site.email ? `mailto:${site.email}` : "" },
  ].filter((l) => l.href);

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xs uppercase tracking-[0.15em] text-muted-2">
            © {year} {site.name} — {site.brand}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  className="font-display text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-stamp-bright"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5">
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-[11px] uppercase tracking-[0.12em] text-muted-2 transition-colors hover:text-stamp-bright"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
