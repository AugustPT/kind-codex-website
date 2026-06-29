import { NextResponse } from "next/server";
import {
  getNurtureContacts,
  sendEmail as sendBrevoEmail,
  updateLead,
} from "@/lib/brevo";
import { NURTURE_SEQUENCE, MAX_STAGE } from "@/lib/nurtureSequence";
import { gmailSync } from "@/lib/gmailSync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BOOKING_URL =
  process.env.BOOKING_URL || "https://calendly.com/august-kindcodex";

// Runs daily (Vercel Cron). Advances every lead who hasn't booked through the
// nurture sequence: if enough days have passed, send their next email and bump
// their stage. This is the "always-on" part of the engine.
export async function GET(request: Request) {
  // Auth: Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when the env is set.
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const contacts = await getNurtureContacts();

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const c of contacts) {
    const a = c.attributes || {};
    if (a.BOOKED === true) {
      skipped++;
      continue;
    }
    const stage = Number(a.NURTURE_STAGE ?? 0);
    if (stage >= MAX_STAGE) {
      skipped++;
      continue;
    }
    const signup = a.SIGNUP_TS ? Date.parse(a.SIGNUP_TS) : NaN;
    if (isNaN(signup)) {
      skipped++;
      continue;
    }
    const daysSince = (now - signup) / 86_400_000;
    const next = NURTURE_SEQUENCE[stage];
    if (!next || daysSince < next.minDays) {
      skipped++;
      continue;
    }

    const p = {
      firstName: a.FIRSTNAME || "there",
      source: a.SOURCE || "clarity-path-home",
      result: a.AUDIT_RESULT || "",
      bookingUrl: BOOKING_URL,
    };

    const res = await sendBrevoEmail({
      to: c.email,
      toName: a.FIRSTNAME,
      subject: next.subject(p),
      html: next.html(p),
    });

    if (res.ok) {
      await updateLead(c.email, { NURTURE_STAGE: stage + 1 });
      sent++;
    } else {
      errors.push(`${c.email}: ${res.detail || "send failed"}`);
    }
  }

  // Auto-advance outbound prospects by scanning Gmail (Sent -> "sent",
  // Inbox -> "replied") so the admin panel stays current with zero manual work.
  let gmail = { sent: 0, replied: 0, mapped: 0, scanned: 0, errors: [] as string[] };
  try {
    gmail = await gmailSync();
  } catch (e) {
    gmail.errors.push((e as Error).message);
  }

  return NextResponse.json({
    ok: true,
    processed: contacts.length,
    sent,
    skipped,
    errors: errors.slice(0, 20),
    gmail,
  });
}
