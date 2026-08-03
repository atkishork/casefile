import { ImageResponse } from "next/og";
import { site } from "@/lib/config";
import { loadPlexMonoFont } from "@/lib/og-font";

export const alt = site.brand;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontText = `${site.brand}${site.name}${site.tagline}`;
  const fontData = await loadPlexMonoFont(fontText);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0c0d0f",
          padding: "80px",
          fontFamily: "Plex Mono",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#c1443c", letterSpacing: 4 }}>
          {site.brand}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 68,
            color: "#ede9dd",
            fontWeight: 600,
          }}
        >
          {site.name}
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 26, color: "#90949a" }}>
          {site.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Plex Mono", data: fontData, style: "normal", weight: 600 }],
    }
  );
}
