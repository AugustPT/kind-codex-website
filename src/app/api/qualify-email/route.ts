import { NextResponse } from "next/server";
import { getClient } from "@/lib/clients";
import { renderQualifierEmail } from "@/lib/qualifyEmail";
import { sendEmail } from "@/lib/brevo";

export const dynamic = "force-dynamic";

// Send the "floor" tap-to-qualify email (real tappable answer buttons in the inbox)
// to a buyer. POST { clientId, to, name?, property? }. Reuses Brevo (no AMP here —
// this is the universal version that works in every client).
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const client = getClient(String(body.clientId || ""));
  if (!client || !client.enabled) {
    return NextResponse.json({ error: "unknown or disabled client" }, { status: 404 });
  }
  const to = String(body.to || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: "valid 'to' email required" }, { status: 400 });
  }

  const { subject, html, text } = renderQualifierEmail({
    client,
    name: String(body.name || "").trim(),
    email: to, // we already have it — prefill the contact step via encrypted token
    property: String(body.property || "").trim(),
  });

  const r = await sendEmail({
    to,
    toName: String(body.name || "") || undefined,
    subject,
    html,
    text,
    replyTo: client.replyToEmail || client.alertEmail,
  });

  return NextResponse.json({ ok: r.ok, status: r.status, detail: r.detail });
}
