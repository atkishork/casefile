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
src/lib/config.ts             ← your name, bio, links, resume, about-page content
src/lib/writeups.ts           ← reads & parses markdown files
src/lib/markdown.ts           ← markdown → HTML rendering pipeline (also used client-side for admin preview)
src/lib/github.ts             ← GitHub Contents API wrapper (publish + delete)
src/lib/session.ts            ← signed session-cookie helper for admin login
src/proxy.ts                  ← session-cookie auth gate for /admin and /api/publish, /api/writeups
src/app/page.tsx              ← home page (recent cases, tag cloud, skills teaser)
src/app/writeups/page.tsx     ← case log (filterable by category or tag)
src/app/writeups/[slug]/      ← individual writeup page
src/app/about/page.tsx        ← dossier / resume page
src/app/admin/page.tsx        ← admin dashboard (stats, list, delete)
src/app/admin/new/page.tsx    ← writer (paste markdown, upload images, publish)
src/app/admin/login/page.tsx  ← admin login page
src/app/api/publish/route.ts  ← commits a writeup + images to GitHub
src/app/api/writeups/[slug]/route.ts ← deletes a writeup + its images from GitHub
src/app/api/admin-login/route.ts     ← verifies credentials, sets session cookie
src/app/api/admin-logout/route.ts    ← clears session cookie
src/components/               ← Nav, Footer, ThemeToggle, CaseCard, StarRating, ToolCard, AdminDashboard, AdminEditor, etc.
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
