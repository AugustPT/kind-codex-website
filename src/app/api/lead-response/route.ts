import { NextResponse } from "next/server";
import { generateLeadResponse } from "@/lib/leadResponse";
import { sendEmail } from "@/lib/brevo";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Public inbound endpoint for the "never-miss-a-lead" product. A buyer inquiry
// comes in (from the demo form, or — for a real client — wired to their website
// forms / Zillow / lead email) and we generate + (optionally) fire the instant
// response in seconds. Returns the round-trip time so the speed is visible.
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const message = String(body.message || "").trim();
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const t0 = Date.now();
  let result;
  try {
    result = await generateLeadResponse({
      name,
      message,
      property: String(body.property || "").trim(),
      agentName: String(body.agentName || "").trim(),
      brokerage: String(body.brokerage || "").trim(),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
  const ms = Date.now() - t0;

  // Optional: actually deliver the agent alert to an address the user controls
  // (the demo uses this so a real alert lands in their inbox). We do NOT email the
  // "buyer" from the demo — that address is fake/unverified.
  let alertSent = false;
  const alertEmail = String(body.alertEmail || "").trim();
  if (alertEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(alertEmail)) {
    const html =
      `<p><strong>🔥 New lead caught in ${(ms / 1000).toFixed(1)}s</strong> — ${result.temperature.toUpperCase()}</p>` +
      `<p><strong>${name || "Unknown"}</strong>${body.property ? ` · ${String(body.property)}` : ""}</p>` +
      `<p style="color:#57534e">${result.agentAlert.replace(/\n/g, "<br/>")}</p>` +
      `<hr/><p style="font-size:13px;color:#8a8a93">Auto-reply that went to the buyer:</p>` +
      `<p style="font-size:13px;white-space:pre-wrap">${result.buyerReply.replace(/\n/g, "<br/>")}</p>`;
    const r = await sendEmail({
      to: alertEmail,
      subject: `🔥 New lead: ${name || "buyer"}${body.property ? ` — ${String(body.property)}` : ""}`,
      html,
    });
    alertSent = r.ok;
  }

  return NextResponse.json({ ok: true, ms, alertSent, ...result });
}
