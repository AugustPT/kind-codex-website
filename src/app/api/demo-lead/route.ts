import { NextResponse } from "next/server";
import { upsertLead, sendEmail } from "@/lib/brevo";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Capture endpoint for traffic that lands on /demo from social/ads. Records the
// visitor as an inbound KindCodex lead, TAGGED with the channel (ref) + which funnel
// they're interested in, enrolls them in nurture, and pings August. This is what
// turns ad/social traffic on the demo into trackable leads.
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (String(body.company_website || "").trim()) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const business = String(body.business || "").trim();
  const ref = String(body.ref || "").trim().slice(0, 80); // channel: facebook / linkedin / ad id
  const funnel = String(body.funnel || "").trim() || "demo";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }

  const firstName = (name || "there").split(" ")[0];
  const source = ref ? `demo:${ref}` : "demo";

  // Enroll in Brevo nurture, tagged by channel + funnel.
  await upsertLead(email, {
    FIRSTNAME: firstName,
    BUSINESS: business,
    COMPANY: business,
    SOURCE: source,
    FUNNEL: funnel,
    REF: ref,
    PIPELINE: "inbound",
    NURTURE_STAGE: 0,
    BOOKED: false,
    SIGNUP_TS: new Date().toISOString(),
  });

  // Ping August, source-tagged so he knows which channel converted.
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || "august@kindcodex.com";
  await sendEmail({
    to: notifyTo,
    replyTo: email,
    subject: `[${source}] New demo lead: ${name || email}${business ? ` (${business})` : ""}`,
    html:
      `<p style="font-family:sans-serif;line-height:1.6">New lead from the <strong>demo</strong> — channel: <strong>${ref || "direct"}</strong>, funnel: <strong>${funnel}</strong>.</p>` +
      `<p style="font-family:sans-serif;line-height:1.6">Name: ${name || "-"}<br/>Business: ${business || "-"}<br/>Email: ${email}</p>` +
      `<p style="font-family:sans-serif;color:#8a8a93;font-size:13px">Enrolled in nurture. Reply to this email to reach them directly.</p>`,
    text: `New demo lead (channel: ${ref || "direct"}, funnel: ${funnel}) — ${name} ${email} ${business}`,
  });

  return NextResponse.json({ ok: true });
}
