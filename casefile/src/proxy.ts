import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

// Protects the private writing portal (/admin) and its publish API with a
// signed session cookie, set by /api/admin-login after checking
// ADMIN_USER/ADMIN_PASSWORD. /admin/login itself must stay reachable
// without a session — that's the chicken-and-egg exception below.
//
// Set ADMIN_USER and ADMIN_PASSWORD as environment variables (locally in
// .env.local, and in your host's Environment Variables settings). Pick a
// long random password — it doubles as the session-signing secret.

export const config = {
  matcher: ["/admin/:path*", "/api/publish/:path*", "/api/writeups/:path*", "/api/notes/:path*"],
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page has to be reachable before you have a session.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;

  // Fail closed: if credentials aren't configured, block access rather
  // than leaving the portal wide open.
  if (!expectedUser || !expectedPass) {
    return new NextResponse("Admin portal is not configured (missing ADMIN_USER/ADMIN_PASSWORD).", {
      status: 503,
    });
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (isValidSessionToken(token)) {
    return NextResponse.next();
  }

  // Not logged in (or session expired). APIs get a JSON 401; the page
  // itself redirects to the login form.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}
