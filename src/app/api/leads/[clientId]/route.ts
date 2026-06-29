import { NextResponse } from "next/server";
import { getClient } from "@/lib/clients";
import { generateLeadResponse } from "@/lib/leadResponse";
import { renderQualifierEmail } from "@/lib/qualifyEmail";
import { sendEmail } from "@/lib/brevo";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// REAL inbound for a delivered client. Point a client's website form / Zillow /
// lead-forwarding at POST /api/leads/<clientId> with { name, email, phone, message,
// property }. We instantly (a) reply to the BUYER (reply-to = the agent, so their
// answer lands with the agent) and (b) alert the AGENT. Returns the round-trip ms.
export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = getClient(clientId);
  if (!client || !client.enabled) {
    return NextResponse.json({ error: "unknown or disabled client" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  // Honeypot: real buyers leave this hidden field empty; bots fill it.
  if (String(body.company_website || "").trim()) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  const name = String(body.name || "").trim();
  const buyerEmail = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  const property = String(body.property || "").trim();
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const t0 = Date.now();
  let result;
  try {
    result = await generateLeadResponse({
      name,
      message,
      property,
      agentName: client.agentName,
      brokerage: client.brokerage,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
  const ms = Date.now() - t0;

  // 1) Instant reply to the buyer. Reply-to routes their response to the agent.
  // If they already tapped through the on-page qualifier (qualified=true), send a
  // plain confirmation. If it's a RAW inbound (e.g. their website form / Zillow),
  // send the interactive TAP-QUALIFIER so they qualify in taps, not a typed reply.
  const qualified = body.qualified === true;
  let buyerEmailed = false;
  if (buyerEmail && EMAIL_RE.test(buyerEmail)) {
    let mail: { subject: string; html: string; text?: string };
    if (qualified) {
      mail = { subject: result.buyerSubject, html: result.buyerReply.replace(/\n/g, "<br/>"), text: result.buyerReply };
    } else {
      const qe = renderQualifierEmail({
        client,
        name,
        email: buyerEmail,
        property,
        intro: result.buyerReply.split("\n")[0], // lead with the AI's warm first line
      });
      mail = { subject: qe.subject, html: qe.html, text: qe.text };
    }
    const r = await sendEmail({
      to: buyerEmail,
      toName: name || undefined,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: client.replyToEmail || client.alertEmail,
    });
    buyerEmailed = r.ok;
  }

  // 2) Alert the agent (this email is also the agent's record of the lead).
  let agentAlerted = false;
  if (client.alertEmail && EMAIL_RE.test(client.alertEmail)) {
    const contact = [name || "Unknown", buyerEmail, phone].filter(Boolean).join(" · ");
    const html =
      `<p><strong>🔥 New ${result.temperature.toUpperCase()} lead — caught in ${(ms / 1000).toFixed(1)}s</strong></p>` +
      `<p><strong>${contact}</strong>${property ? `<br/>Interested in: ${property}` : ""}</p>` +
      `<p style="color:#57534e">${result.agentAlert.replace(/\n/g, "<br/>")}</p>` +
      (result.why ? `<p style="font-size:13px;color:#8a8a93">Read: ${result.why}</p>` : "") +
      `<hr/><p style="font-size:13px;color:#8a8a93">Their original message:</p>` +
      `<p style="font-size:13px;white-space:pre-wrap;color:#44403c">${message.replace(/\n/g, "<br/>")}</p>` +
      `<p style="font-size:13px;color:#8a8a93">Auto-reply ${buyerEmailed ? "sent to the buyer" : "NOT sent (no valid buyer email — call/text them)"}:</p>` +
      `<p style="font-size:13px;white-space:pre-wrap">${result.buyerReply.replace(/\n/g, "<br/>")}</p>`;
    const r = await sendEmail({
      to: client.alertEmail,
      subject: `🔥 New lead for ${client.agentName}: ${name || "buyer"}${property ? ` — ${property}` : ""}`,
      html,
    });
    agentAlerted = r.ok;
  }

  return NextResponse.json({ ok: true, ms, temperature: result.temperature, buyerEmailed, agentAlerted });
}

// Lightweight health/identity check so a client setup can be verified without sending.
export async function GET(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = getClient(clientId);
  if (!client || !client.enabled) {
    return NextResponse.json({ error: "unknown or disabled client" }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    client: { id: client.id, agentName: client.agentName, brokerage: client.brokerage || null },
    usage: `POST JSON { name, email, phone, message, property } to /api/leads/${client.id}`,
  });
}
