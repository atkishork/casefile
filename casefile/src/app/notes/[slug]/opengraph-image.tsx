import { ImageResponse } from "next/og";
import { getNoteBySlug, getAllNotes } from "@/lib/notes";
import { padNote } from "@/lib/format";
import { site } from "@/lib/config";
import { loadPlexMonoFont } from "@/lib/og-font";

export const alt = "Field note preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllNotes().map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  const title = note?.title ?? site.brand;
  const noteLabel = note ? padNote(note.noteNumber) : "";

  const fontData = await loadPlexMonoFont();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0c0d0f",
          padding: "64px",
          fontFamily: "Plex Mono",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#c1443c", letterSpacing: 4 }}>
            {site.brand} — FIELD NOTES
          </div>
          {noteLabel && (
            <div style={{ display: "flex", fontSize: 22, color: "#90949a" }}>{noteLabel}</div>
          )}
        </div>

        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 46 ? 52 : 64,
              color: "#ede9dd",
              fontWeight: 600,
              lineHeight: 1.25,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Plex Mono", data: fontData, style: "normal", weight: 600 }],
    }
  );
}
