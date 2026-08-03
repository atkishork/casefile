// next/og's ImageResponse renders via Satori, which can't reference a
// system/Google Font by name the way normal CSS can — it needs the actual
// font file bytes. This fetches just the glyphs actually used (via the
// `text` param) from Google Fonts at request/build time.
//
// If this ever needs to run somewhere without outbound internet access,
// swap this for a font file bundled in the repo instead.

let cachedFont: ArrayBuffer | null = null;
let cachedText = "";

export async function loadPlexMonoFont(text: string): Promise<ArrayBuffer> {
  // Cache the widest character set requested so far, per server instance —
  // avoids re-fetching on every image render.
  if (cachedFont && cachedText.includes(text)) return cachedFont;

  const cssUrl = `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600&text=${encodeURIComponent(text)}`;
  const cssRes = await fetch(cssUrl, {
    headers: {
      // Google serves modern woff2 by default for most UAs, but Satori
      // needs ttf/otf — an old UA string gets us a truetype src instead.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36",
    },
  });
  const css = await cssRes.text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error("Could not locate a usable font URL in Google Fonts CSS response.");

  const fontRes = await fetch(match[1]);
  const buffer = await fontRes.arrayBuffer();

  cachedFont = buffer;
  cachedText = text;
  return buffer;
}
