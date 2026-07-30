import crypto from "crypto";

// A minimal signed-session scheme for the single-admin writing portal.
// No database, no JWT library — just an expiry timestamp plus an HMAC
// signature over that timestamp, keyed on ADMIN_PASSWORD. Tampering with
// the expiry invalidates the signature; the check is timing-safe.
//
// Deliberately reuses ADMIN_PASSWORD as the signing key rather than adding
// a separate SESSION_SECRET env var — one less thing to configure. If you'd
// rather separate the two, add a SESSION_SECRET env var and swap it in
// below.

export const SESSION_COOKIE_NAME = "casefile_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSigningSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

export function createSessionToken(): { token: string; maxAgeSeconds: number } | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const expiry = Date.now() + SESSION_DURATION_MS;
  const signature = crypto.createHmac("sha256", secret).update(String(expiry)).digest("hex");
  return { token: `${expiry}.${signature}`, maxAgeSeconds: Math.floor(SESSION_DURATION_MS / 1000) };
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  const secret = getSigningSecret();
  if (!secret || !token) return false;

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return false;

  const expiryStr = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = crypto.createHmac("sha256", secret).update(expiryStr).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    // Length mismatch, malformed hex, etc. — treat as invalid, not a crash.
    return false;
  }
}
