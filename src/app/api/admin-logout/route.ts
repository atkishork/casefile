import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

// Intentionally not gated — clearing a cookie you may not even have a
// valid version of shouldn't itself require a valid session.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
