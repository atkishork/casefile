# CASEFILE — CTF writeup blog & resume

A dark, case-file-themed personal site for publishing CTF writeups and
serving as a living resume. Built with Next.js 16 (App Router), TypeScript,
and Tailwind CSS v4. Writeups are plain markdown files — no CMS, no
database.

## Stack

- **Next.js** (App Router, static generation) — deploys cleanly to Vercel
- **Tailwind CSS v4** — design tokens live in `src/app/globals.css`
- **Markdown** — `gray-matter` for frontmatter, `unified`/`remark`/`rehype`
  for rendering + syntax highlighting
- **Fonts** — IBM Plex Mono (headings/labels), IBM Plex Sans (body),
  JetBrains Mono (code), loaded via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pages are statically generated at build time
(`npm run build`), so hosting is essentially free anywhere that serves
static files + a Node runtime (Vercel is the path of least resistance).

## Adding a writeup

1. Add a markdown file to `content/writeups/your-slug.md`. The filename
   becomes the URL: `/writeups/your-slug`.
2. Fill in the frontmatter block at the top — see
   `content/writeups/sample-formatting-demo.md` for every supported field
   and a tour of the markdown features (code blocks, tables, images,
   callouts). **Delete that sample file once you've published real
   writeups.**
3. Case numbers (`CASE-001`, `CASE-002`, ...) are assigned automatically
   based on the `date` field — oldest is #1. You never set them by hand,
   and inserting an older writeup later renumbers everything correctly.
4. Drop any screenshots in `public/writeups/your-slug/` and reference them
   with `![alt text](/writeups/your-slug/image.png)`.

## Editing your info (the "resume" part)

Everything personal — name, tagline, bio, focus areas, certifications,
projects, social links, résumé PDF — lives in one file:

```
src/lib/config.ts
```

Nothing else in the codebase needs to change to update your name or add a
link. Fields marked `// TODO` are placeholders — fill those in before you
publish (email, GitHub, LinkedIn, domain).

If you want a downloadable PDF résumé, drop it in `public/` (e.g.
`public/resume.pdf`) and set `resumePdf: "/resume.pdf"` in `config.ts` — a
download button appears on the Dossier page automatically.

## Project structure

```
content/writeups/*.md        ← your writeups (the only place you edit content day-to-day)
content/notes/*.md            ← your field notes / blog posts
assets/ibm-plex-mono-600.woff ← bundled font used by the OG image generator (see Social preview images)
src/lib/config.ts             ← your name, bio, links, resume, about-page content
src/lib/writeups.ts           ← reads & parses writeup markdown files, handles draft filtering
src/lib/notes.ts              ← same, for field notes (separate NOTE-### numbering)
src/lib/markdown.ts           ← markdown → HTML rendering pipeline + table-of-contents extraction (shared by both)
src/lib/github.ts             ← GitHub Contents API wrapper (publish, edit, delete)
src/lib/session.ts            ← signed session-cookie helper for admin login
src/lib/og-font.ts            ← reads the bundled font for both opengraph-image files
src/proxy.ts                  ← session-cookie auth gate for /admin and its APIs
src/app/page.tsx              ← home page (recent cases, tag cloud, skills teaser)
src/app/opengraph-image.tsx   ← default social preview image
src/app/writeups/page.tsx     ← case log (filterable by category or tag)
src/app/writeups/[slug]/      ← individual writeup page, incl. its own opengraph-image.tsx
src/app/notes/page.tsx        ← field notes list (filterable by tag)
src/app/notes/[slug]/         ← individual note page, incl. its own opengraph-image.tsx
src/app/about/page.tsx        ← dossier / resume page
src/app/admin/page.tsx        ← admin dashboard for writeups (stats, list, delete)
src/app/admin/new/page.tsx    ← writeup writer
src/app/admin/edit/[slug]/    ← reopen an existing writeup (or resume a draft) for editing
src/app/admin/notes/          ← same three (dashboard, new, edit) for field notes
src/app/admin/login/page.tsx  ← admin login page
src/app/api/publish/route.ts  ← commits a writeup OR note (+ images) to GitHub, incl. edits
src/app/api/writeups/[slug]/route.ts ← deletes a writeup + its images
src/app/api/notes/[slug]/route.ts    ← deletes a note + its images
src/app/api/admin-login/route.ts     ← verifies credentials, sets session cookie
src/app/api/admin-logout/route.ts    ← clears session cookie
src/components/               ← Nav, Footer, ThemeToggle, CaseCard, NoteCard, TableOfContents, StarRating, ToolCard, AdminDashboard, AdminEditor, etc.
src/app/globals.css           ← color palette (dark + light), typography, redaction effect, animations
.env.local.example            ← template for the env vars the admin portal needs
```

## Writing from the admin portal (no code editor needed)

There's a private page at `/admin` — a dashboard showing stats and every
published case, with **Delete** buttons and a **+ New case file** button
that opens the writer (`/admin/new`). Publishing and deleting both commit
straight to your GitHub repo via the GitHub API; since Vercel watches that
repo, publishes show up on the live site within a minute or two.

Deletes remove the file from GitHub immediately and disappear from the
dashboard's list right away (that part doesn't wait on a redeploy) — but
the dashboard's initial list, like the live site, reflects the last
completed deploy, so refreshing the page before the next deploy finishes
can briefly show a just-deleted entry again. It'll clear up once that
deploy completes.

**One-time setup:**

1. Copy `.env.local.example` to `.env.local` and fill in:
   - `ADMIN_USER` / `ADMIN_PASSWORD` — your login for `/admin`. Visiting
     `/admin` while logged out redirects you to a login page (styled like
     the rest of the site, not a browser popup) — enter these there.
   - `GITHUB_TOKEN` — a token (Settings → Developer settings → Fine-grained
     tokens on GitHub) scoped to just this repo with **Contents: Read and
     write** permission.
   - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` — which repo/branch to
     commit to.
2. Add the same variables in your host's dashboard (Vercel → Project →
   Settings → Environment Variables) so it works in production too.
3. Visit `/admin`, log in, and publish your first case file. A **Log out**
   button in the top-right of `/admin` ends the session immediately —
   useful on a shared or public machine.

**How the login works:** submitting the login form sets an `httpOnly`
session cookie (signed with `ADMIN_PASSWORD`, valid 7 days) — this is what
lets you actually log out, which plain browser Basic Auth can't do (browsers
cache Basic Auth credentials with no API to clear them). Logging out just
deletes that cookie.

Without `ADMIN_USER`/`ADMIN_PASSWORD` set, `/admin` and its API refuse all
requests (fails closed) rather than being left open. It's not linked from
anywhere on the site, and the page sets `noindex` — but the real protection
is the session check, not obscurity.

If you'd rather just write files locally and `git push` yourself, that
still works exactly as before — the admin portal is an optional convenience,
not a requirement.

## Field Notes (blog / written notes)

A second, separate content type alongside writeups — for blog posts, notes,
opinions, anything that isn't a CTF case file. Lives at `/notes` in the nav
("Field Notes"), with its own admin dashboard at `/admin/notes`.

It shares the same underlying engine as writeups (markdown rendering, code
syntax highlighting, table of contents, images, drafts, social preview
images) but with a deliberately simpler frontmatter — no category,
difficulty, or CTF fields, just:

```yaml
---
title: "Post title"
date: "2026-08-01"
tags: ["career", "opinion"]
summary: "One or two sentences shown on the notes list."
draft: false
---
```

Add a note the same way as a writeup: drop a `.md` file in
`content/notes/`, or use the writer at `/admin/notes/new`. Images go in
`public/notes/your-slug/`. Numbering is separate from writeups too —
`NOTE-001`, `NOTE-002`, etc. — so publishing a note never shifts a case
file's number or vice versa.

The admin dashboard has a small **Case Files / Field Notes** toggle at the
top so you can jump between managing the two.

## Table of contents

Writeup pages with 2+ `##`/`###` headings automatically get a table of
contents — a sticky sidebar on desktop, a collapsible "On this page" section
on mobile (no JS needed for that one, it's a native `<details>` element).
Nothing to configure; it's generated from your actual headings every time.

## Drafts, and editing/resuming a writeup

Checking "Save as draft" in the writer commits the file to GitHub but keeps
it off every public page (home, case log, tag cloud, sitemap) and blocks
direct URL access too — it's genuinely unpublished, not just unlisted.

To finish a draft later (or fix a typo in something already published), use
the **Edit** / **Resume** link next to any writeup in the `/admin`
dashboard — it reopens the writer with everything pre-filled, including the
existing markdown content. Saving writes back to the same file (the slug is
locked while editing, so you don't accidentally fork it into a second file)
rather than creating a new commit's worth of duplicate content.

## Social preview images

Every writeup and every field note gets an automatically-generated Open
Graph image — when you share a link on LinkedIn/Twitter/Discord/etc., it
shows a branded card with the title and a few key details instead of
nothing. The home page and other top-level pages get a simpler site-wide
version. Nothing to configure — these regenerate automatically from
`src/lib/config.ts` and each post's frontmatter.

**One thing worth setting once you have a real domain:** `site.domain` in
`src/lib/config.ts` needs to be your actual deployed URL for these images
(and the sitemap) to resolve correctly when shared — while it's still the
placeholder `casefile.example.com`, both fall back to a clearly-fake URL
rather than silently pointing at the wrong domain.

**Font, technical note:** these images use a font file bundled directly in
the repo (`assets/ibm-plex-mono-600.woff`), read via `src/lib/og-font.ts`,
rather than being fetched from Google Fonts at request time. An earlier
version fetched from Google Fonts, which worked locally but broke the
Vercel build (their CSS response didn't match the format that approach
assumed). If you ever want to swap this font, replace that `.woff` file —
`next/og`'s renderer (Satori) supports `.ttf`, `.otf`, and `.woff`, but
**not** `.woff2`.

## Skills, Tools, Achievements, and certificates

The Dossier page's "Skills" section is a flat list (`about.skills` in
`src/lib/config.ts`) — languages and general skills, no grouping.

"Tools" (`about.tools`) is separate: each entry is `{ name, icon, rating }`,
rendered as a card with a 1–5 star proficiency rating. `icon` is optional —
drop a logo image in `public/tools/` and point to it (e.g.
`"/tools/burpsuite.png"`), or leave it `""` for an automatic monogram box
instead (same fallback pattern as the profile photo).

Achievements (`about.achievements`) each support an optional
`certificateUrl` — link to a PDF you've dropped in `public/`, an image, or
a verification page (Credly, etc.). Leave it `""` to hide the link on that
achievement.

## Tags on the homepage

The homepage shows every tag used across your writeups as clickable pills
with post counts (e.g. `#xxe (2)`), computed automatically — nothing to
configure. Clicking one filters the case log by that tag
(`/writeups?tag=xxe`); it's mutually exclusive with the category filter
buttons on that page (picking a category clears the tag filter, and vice
versa).

## Dark / light mode

A toggle in the nav (both desktop and mobile) switches themes and remembers
your choice in the browser. Defaults to your system preference on first
visit. Code blocks intentionally stay dark in both themes for consistent
syntax-highlighting contrast — everything else (backgrounds, text, the
redaction effect) swaps to a lighter "declassified on paper" palette.

## The Dossier (about) page

Ordered as: name → where you work → social links & résumé download → short
bio → skills → tools → achievements → certifications → education →
projects → selected case work. All of it is editable in `src/lib/config.ts`
under the `about` export — nothing in the page component itself needs
touching to update content.

## Profile picture

Drop a photo in `public/` (e.g. `public/profile.jpg`) and set
`avatar: "/profile.jpg"` in `src/lib/config.ts`. Until you do, the Dossier
page shows a styled placeholder (your initials in a bordered box) instead
of a broken image — nothing to configure to avoid that.

## Footer pages

Privacy Policy, Disclaimer, and Sitemap pages are linked in the footer.
Privacy and Disclaimer are generic templates — read through them and adjust
anything that doesn't match reality (e.g. if you add analytics later, the
Privacy Policy should say so). Sitemap is two things: a human-readable
`/sitemap` page listing every page and writeup, and a machine-readable
`/sitemap.xml` (via `src/app/sitemap.ts`) for search engines — both update
automatically as you publish. The XML one needs `site.domain` set in
`src/lib/config.ts` to generate correct absolute URLs.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. No environment variables or build config needed — Vercel auto-detects
   Next.js. Click deploy.
4. Every time you push a new writeup to `main`, Vercel rebuilds and
   redeploys automatically.

## Design notes

The visual language is a "declassified case file" — CASE-### numbering,
stamp-style badges, and a signature interaction: writeup excerpts on the
case log sit behind a redacted bar that slides away on hover (or keyboard
focus) to reveal the summary. On touch devices the excerpt is always shown
plainly, since there's no hover to reveal it.

Color palette, type scale, and the redaction effect are all defined in
`src/app/globals.css` if you want to adjust them.
