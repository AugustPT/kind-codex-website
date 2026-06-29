import { NextResponse } from "next/server";
import { updateLead } from "@/lib/brevo";
import { sendGradeTest } from "@/lib/grader";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A realtor consents to be graded: capture them as a pull-funnel lead, then send the
// sample buyer inquiry that starts the response-time clock. The score is delivered later
// (live status poll or the cron backstop) once they reply.
export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const email = String(body.email || "").toLowerCase().trim();
  const name = String(body.name || "").trim();
  const business = String(body.business || "").trim();
  const website = String(body.website || "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid business email." }, { status: 400 });
  }
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "Grader temporarily unavailable." }, { status: 500 });
  }

  // Send the sample inquiry first; its send time is the clock start.
  let sentAt: string;
  try {
    sentAt = await sendGradeTest(email, name);
  } catch {
    return NextResponse.json({ error: "Could not send the test inquiry. Try again." }, { status: 502 });
  }

  // Capture as a grader lead in the CRM (reusing existing attributes so no Brevo schema change).
  try {
    await updateLead(email, {
      PIPELINE: "grader",
      STAGE: "grader",
      FUNNEL: "grade",
      FIRSTNAME: name,
      COMPANY: business,
      CONTACT_URL: website,
      CONTACT_EMAIL: email,
      SIGNUP_TS: sentAt,
      SOURCE: "lead-response-grader",
    });
  } catch { /* non-fatal: the test already went out */ }

  return NextResponse.json({ ok: true, sentAt });
}
