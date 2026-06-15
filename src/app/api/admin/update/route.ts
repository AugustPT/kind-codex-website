import { NextResponse } from "next/server";
import { updateLead } from "@/lib/brevo";

export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

// Manually advance an outbound prospect's stage (e.g. drafted -> sent -> replied).
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { email, stage } = await req.json();
  if (!email || !stage) {
    return NextResponse.json({ error: "email and stage required" }, { status: 400 });
  }
  await updateLead(String(email), { STAGE: String(stage) } as any);
  return NextResponse.json({ ok: true });
}
