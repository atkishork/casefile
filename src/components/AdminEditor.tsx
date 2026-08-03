"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { markdownToHtml } from "@/lib/markdown";
import type { Category, Difficulty, Status } from "@/lib/types";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { UploadCloud, X, Wand2, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

interface UploadedImage {
  filename: string;
  base64: string;
  previewUrl: string;
}

type PublishResult =
  | { ok: true; slug: string; url: string; draft: boolean }
  | { ok: false; error: string };

export interface AdminEditorInitial {
  slug: string;
  title: string;
  date: string;
  ctf: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  status: Status;
  draft: boolean;
  content: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const inputClass =
  "w-full rounded border border-line bg-panel px-3 py-2 text-sm text-text placeholder:text-muted-2 focus:border-stamp-dim focus:outline-none";
const labelClass = "font-display text-[11px] uppercase tracking-[0.1em] text-muted";

export default function AdminEditor({ initial }: { initial?: AdminEditorInitial }) {
  const isEditing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [ctf, setCtf] = useState(initial?.ctf ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "web");
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "medium");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "solved");
  const [draft, setDraft] = useState(initial?.draft ?? false);
  const [slugOverride, setSlugOverride] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const slug = useMemo(() => {
    const base = slugOverride || title;
    return base
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }, [title, slugOverride]);

  // Debounced live preview — reuses the exact same renderer the real site uses.
  useEffect(() => {
    const handle = setTimeout(() => {
      markdownToHtml(content.trim() ? content : "*Nothing written yet — start typing on the left.*").then(
        (rendered) => setPreviewHtml(rendered.html)
      );
    }, 350);
    return () => clearTimeout(handle);
  }, [content]);

  function handleImageFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] ?? "";
        setImages((prev) => [...prev, { filename: file.name, base64, previewUrl: dataUrl }]);
      };
      reader.readAsDataURL(file);
    });
  }

  function insertImageMarkdown(img: UploadedImage) {
    const snippet = `![${img.filename}](/writeups/${slug || "your-slug"}/${img.filename})`;
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => `${c}\n${snippet}\n`);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = `${content.slice(0, start)}\n${snippet}\n${content.slice(end)}`;
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length + 2;
      el.setSelectionRange(pos, pos);
    });
  }

  function removeImage(filename: string) {
    setImages((prev) => prev.filter((i) => i.filename !== filename));
  }

  async function handlePublish() {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          ctf,
          category,
          difficulty,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          summary,
          status,
          content,
          slug: slug || undefined,
          images: images.map(({ filename, base64 }) => ({ filename, base64 })),
          draft,
        }),
      });
      const data = await res.json();
      setResult(
        res.ok
          ? { ok: true, slug: data.slug, url: data.url, draft: Boolean(data.draft) }
          : { ok: false, error: data.error }
      );
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Network error." });
    } finally {
      setSubmitting(false);
    }
  }

  const canPublish = Boolean(title && date && ctf && summary && content) && !submitting;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* ------------------------------------------------------------ */}
      {/* Form                                                          */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            className={`${inputClass} mt-1.5`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Login Bypass via SQL Injection"
          />
          {isEditing ? (
            <p className="mt-1 text-xs text-muted-2">
              Slug: <code className="font-code">{slug}</code> — locked while
              editing (changing it would create a new file instead of
              updating this one).
            </p>
          ) : (
            <>
              <p className="mt-1 text-xs text-muted-2">
                Slug: <code className="font-code">{slug || "—"}</code>
                {" · "}
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-2 hover:text-stamp-bright"
                  onClick={() => setSlugOverride(slugOverride ? "" : slug)}
                >
                  {slugOverride ? "using custom slug" : "override slug"}
                </button>
              </p>
              {slugOverride !== "" && (
                <input
                  className={`${inputClass} mt-1.5`}
                  value={slugOverride}
                  onChange={(e) => setSlugOverride(e.target.value)}
                  placeholder="custom-slug"
                />
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date *</label>
            <input
              type="date"
              className={`${inputClass} mt-1.5`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>CTF / event *</label>
            <input
              className={`${inputClass} mt-1.5`}
              value={ctf}
              onChange={(e) => setCtf(e.target.value)}
              placeholder="picoCTF 2026"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={`${inputClass} mt-1.5`}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select
              className={`${inputClass} mt-1.5`}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={`${inputClass} mt-1.5`}
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="solved">Solved</option>
              <option value="wip">In progress</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            className={`${inputClass} mt-1.5`}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="sqli, auth-bypass, web"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded border border-line bg-panel/40 p-3">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-stamp"
          />
          <span className="text-sm text-muted">
            <span className="font-display text-xs uppercase tracking-[0.08em] text-paper">
              Save as draft
            </span>
            <br />
            Commits the file, but it won&apos;t appear on the home page, case
            log, tag cloud, or sitemap — not even by direct URL — until you
            come back and uncheck this.
          </span>
        </label>

        <div>
          <label className={labelClass}>Summary * (shown on the case-log card)</label>
          <textarea
            className={`${inputClass} mt-1.5`}
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One or two sentences — this is the redacted excerpt on the case log."
          />
        </div>

        {/* Images */}
        <div>
          <label className={labelClass}>Images</label>
          <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-line py-4 text-sm text-muted hover:border-stamp-dim hover:text-paper">
            <UploadCloud size={16} />
            Click to upload screenshots
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageFiles(e.target.files)}
            />
          </label>

          {images.length > 0 && (
            <ul className="mt-3 space-y-2">
              {images.map((img) => (
                <li
                  key={img.filename}
                  className="flex items-center gap-3 rounded border border-line bg-panel/40 p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.filename}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />
                  <span className="flex-1 truncate font-code text-xs text-muted">{img.filename}</span>
                  <button
                    type="button"
                    onClick={() => insertImageMarkdown(img)}
                    className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 font-display text-[10px] uppercase tracking-wide text-muted hover:border-stamp-dim hover:text-paper"
                    title="Insert markdown reference at cursor"
                  >
                    <Wand2 size={11} /> Insert
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(img.filename)}
                    className="text-muted-2 hover:text-stamp-bright"
                    aria-label={`Remove ${img.filename}`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1.5 text-xs text-muted-2">
            Uploading commits each image to{" "}
            <code className="font-code">public/writeups/{slug || "your-slug"}/</code>. Click
            &quot;Insert&quot; to drop the markdown reference into your content at the cursor.
          </p>
        </div>

        <div>
          <label className={labelClass}>Content * (markdown)</label>
          <textarea
            ref={textareaRef}
            className={`${inputClass} mt-1.5 font-code`}
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"## Challenge overview\n\nPaste or write your writeup here..."}
          />
        </div>

        <button
          type="button"
          disabled={!canPublish}
          onClick={handlePublish}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-stamp px-4 py-3 font-display text-xs uppercase tracking-[0.12em] text-paper transition-all duration-150 hover:bg-stamp-bright active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> {draft ? "Saving draft…" : isEditing ? "Saving…" : "Publishing…"}
            </>
          ) : draft ? (
            "Save draft"
          ) : isEditing ? (
            "Save changes"
          ) : (
            "Publish case file"
          )}
        </button>

        {result && (
          <div
            className={`flex items-start gap-2 rounded border p-3 text-sm ${
              result.ok ? "border-stamp text-stamp-bright" : "border-line text-muted"
            }`}
          >
            {result.ok ? (
              <>
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>
                  {result.draft ? (
                    <>
                      Saved as a draft — committed to your repo, but hidden
                      from the live site. Come back to{" "}
                      <code className="font-code">/admin</code> anytime to
                      finish and publish it.
                    </>
                  ) : (
                    <>
                      Committed. Once your host redeploys, it&apos;ll be live
                      at <code className="font-code">{result.url}</code>.
                    </>
                  )}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{result.error}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Live preview                                                  */}
      {/* ------------------------------------------------------------ */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <p className={labelClass}>Live preview</p>
        <div className="mt-1.5 max-h-[80vh] overflow-y-auto rounded border border-line bg-panel/20 p-5">
          <p className="font-display text-xs tracking-[0.12em] text-stamp">
            {slug ? `CASE — ${slug}` : "CASE —"}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-paper">
            {title || "Untitled case"}
          </h2>
          <div
            className="prose-case mt-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  );
}
