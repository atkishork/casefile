import { ImageResponse } from "next/og";
import { getWriteupBySlug, getAllWriteups } from "@/lib/writeups";
import { CATEGORY_LABELS } from "@/lib/types";
import { padCase } from "@/lib/format";
import { site } from "@/lib/config";
import { loadPlexMonoFont } from "@/lib/og-font";

export const alt = "Case file preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllWriteups().map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writeup = getWriteupBySlug(slug);

  const title = writeup?.title ?? site.brand;
  const caseLabel = writeup ? padCase(writeup.caseNumber) : "";
  const category = writeup ? CATEGORY_LABELS[writeup.category] : "";
  const ctf = writeup?.ctf ?? "";

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
            {site.brand}
          </div>
          {caseLabel && (
            <div style={{ display: "flex", fontSize: 22, color: "#90949a" }}>{caseLabel}</div>
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

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#90949a" }}>
          {category && (
            <div
              style={{
                display: "flex",
                border: "2px solid #2a2c30",
                borderRadius: 6,
                padding: "8px 18px",
                color: "#e0564d",
              }}
            >
              {category}
            </div>
          )}
          {ctf && <div style={{ display: "flex" }}>{ctf}</div>}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Plex Mono", data: fontData, style: "normal", weight: 600 }],
    }
  );
}
