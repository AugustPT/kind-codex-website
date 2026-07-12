import { NextResponse } from "next/server";
import { saveLiToken } from "@/lib/liStore";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

// The admin browser syncs the LinkedIn member token (from localStorage "kc_li") to
// the server ONCE, so the daily cron can post while August is away. The token is
// chunked into a Brevo system contact; it never appears in a response or a log line.
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { token, urn } = await req.json();
  if (!token || !urn) return NextResponse.json({ error: "missing token/urn" }, { status: 400 });
  const ok = await saveLiToken(String(token), String(urn));
  if (!ok) return NextResponse.json({ error: "store failed (check BREVO_API_KEY)" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
