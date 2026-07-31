import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ExternalLink, FileDown, ArrowRight, Award } from "lucide-react";
import { site, about } from "@/lib/config";
import { getAllWriteups } from "@/lib/writeups";
import { padCase } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/types";
import Avatar from "@/components/Avatar";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: `Dossier — ${site.name}`,
  description: site.summary,
};

export default function AboutPage() {
  const writeups = getAllWriteups();
  const selected = writeups.slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-stamp">
        Personnel file
      </p>

      {/* Photo + name */}
      <div className="mt-3 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar />
        <div>
          <h1 className="font-display text-2xl font-bold text-paper sm:text-4xl">
            {site.name}
          </h1>
          <p className="mt-2 font-display text-sm uppercase tracking-[0.1em] text-muted">
            {site.workplace}
          </p>
        </div>
      </div>

      {/* Social links + résumé download — shows whichever socials you've
          filled in under site.socials in src/lib/config.ts; empty ones
          are skipped automatically. */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { label: "LinkedIn", href: site.socials.linkedin },
          { label: "GitHub", href: site.socials.github },
          { label: "Medium", href: site.socials.medium },
          { label: "Twitter", href: site.socials.twitter },
        ]
          .filter((s) => s.href)
          .map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:border-stamp-dim hover:text-paper"
            >
              <ExternalLink size={13} /> {s.label}
            </a>
          ))}
        {site.email && (
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:border-stamp-dim hover:text-paper"
          >
            <Mail size={13} /> Email
          </a>
        )}
        {site.resumePdf ? (
          <a
            href={site.resumePdf}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded bg-stamp px-3 py-1.5 font-display text-xs uppercase tracking-[0.1em] text-paper hover:bg-stamp-bright"
          >
            <FileDown size={13} /> Download résumé
          </a>
        ) : (
          <span
            title="Set site.resumePdf in src/lib/config.ts once you've added a PDF to /public"
            className="inline-flex items-center gap-1.5 rounded border border-dashed border-line px-3 py-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted-2"
          >
            <FileDown size={13} /> Résumé PDF not set
          </span>
        )}
      </div>

      {/* Short bio */}
      <section className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          01 — Bio
        </h2>
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          {about.bio.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted sm:text-base">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          02 — Skills
        </h2>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          {about.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-sm border border-line px-2.5 py-1 text-sm text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          03 — Tools
        </h2>
        <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
          {about.tools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          04 — Achievements
        </h2>
        <div className="mt-4 divide-y divide-line border-t border-line">
          {about.achievements.map((a) => (
            <div key={a.title} className="flex items-start gap-3 py-4">
              <Award size={16} className="mt-0.5 shrink-0 text-stamp-bright" />
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-display text-sm text-paper">{a.title}</p>
                  {a.date && (
                    <span className="font-display text-[11px] text-muted-2">{a.date}</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{a.description}</p>
                {a.certificateUrl && (
                  <a
                    href={a.certificateUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1.5 inline-flex items-center gap-1 font-display text-[11px] uppercase tracking-[0.08em] text-stamp-bright hover:text-paper"
                  >
                    <ExternalLink size={11} /> View certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          05 — Certifications &amp; training
        </h2>
        <div className="mt-4 divide-y divide-line border-t border-line">
          {about.certifications.map((c) => (
            <div key={c.name} className="flex items-start justify-between gap-4 py-4">
              <div>
                <p className="font-display text-sm text-paper">{c.name}</p>
                <p className="mt-1 text-sm text-muted">{c.note}</p>
              </div>
              <span
                className={`shrink-0 rounded-sm border px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.1em] ${
                  c.status === "Completed"
                    ? "border-stamp text-stamp-bright"
                    : "border-line text-muted"
                }`}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
          06 — Education
        </h2>
        <div className="mt-4 divide-y divide-line border-t border-line">
          {about.education.map((e) => (
            <div key={e.institution} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="font-display text-sm text-paper">{e.institution}</p>
                {e.duration && (
                  <span className="font-display text-[11px] text-muted-2">{e.duration}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{e.credential}</p>
              {e.note && <p className="mt-1 text-sm text-muted-2">{e.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      {about.projects.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
            07 — Projects
          </h2>
          <div className="mt-4 space-y-5 border-t border-line pt-4">
            {about.projects.map((p) => (
              <div key={p.name}>
                <p className="font-display text-sm text-paper">
                  {p.name}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-2 text-stamp-bright"
                    >
                      ↗
                    </a>
                  )}
                </p>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected case work */}
      {selected.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xs uppercase tracking-[0.15em] text-stamp">
            08 — Selected case work
          </h2>
          <div className="mt-4 divide-y divide-line border-t border-line">
            {selected.map((w) => (
              <Link
                key={w.slug}
                href={`/writeups/${w.slug}`}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <span className="font-display text-xs text-stamp">
                    {padCase(w.caseNumber)}
                  </span>
                  <p className="mt-0.5 font-display text-sm text-paper group-hover:text-stamp-bright">
                    {w.title}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-2">
                    {CATEGORY_LABELS[w.category]} · {w.ctf}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-muted-2 transition-colors group-hover:text-stamp-bright"
                />
              </Link>
            ))}
          </div>
          <Link
            href="/writeups"
            className="mt-5 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.1em] text-muted hover:text-stamp-bright"
          >
            Full case log <ArrowRight size={13} />
          </Link>
        </section>
      )}
    </div>
  );
}
