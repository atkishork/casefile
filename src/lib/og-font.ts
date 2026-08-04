import { readFile } from "node:fs/promises";
import path from "node:path";

// Bundled directly in the repo (assets/ibm-plex-mono-600.woff) rather than
// fetched from Google Fonts at request time — a previous version of this
// file fetched Google's CSS response and parsed it for a font URL, which
// worked in local dev but broke on Vercel's build servers (their CSS
// response didn't match the assumed format, failing the whole build).
// Reading a file that's actually committed to the repo can't have that
// class of failure. Font format: Satori (which powers next/og's
// ImageResponse) supports ttf/otf/woff — NOT woff2, hence .woff here.
//
// Loaded once and cached at module scope per Next.js's own guidance, so
// warm serverless invocations reuse the same bytes instead of re-reading
// the file every request.

let fontPromise: Promise<Buffer> | null = null;

export function loadPlexMonoFont(): Promise<Buffer> {
  if (!fontPromise) {
    fontPromise = readFile(path.join(process.cwd(), "assets", "ibm-plex-mono-600.woff"));
  }
  return fontPromise;
}
