import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

// Deliberately NOT gated by proxy.ts — you don't have a session yet when
// logging in. Security comes from checking the credentials here.

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return NextResponse.json(
      { error: "Admin portal is not configured (missing ADMIN_USER/ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  if (body.username !== expectedUser || body.password !== expectedPass) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const session = createSessionToken();
  if (!session) {
    return NextResponse.json({ error: "Could not create a session." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAgeSeconds,
  });
  return res;
}
