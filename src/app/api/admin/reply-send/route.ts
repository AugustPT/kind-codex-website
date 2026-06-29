import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { updateLead } from "@/lib/brevo";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

// Send August's (reviewed/edited) reply to a prospect, then mark it handled so it
// leaves the review queue. Optional `stage` lets the panel mark won/dead instead.
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { email, subject, body, stage } = await req.json();

  // "Mark only" (no send) — e.g. dismiss / mark dead — when no body is provided.
  if (email && !body) {
    await updateLead(String(email), { REPLY_HANDLED: true, ...(stage ? { STAGE: String(stage) } : {}) } as never);
    return NextResponse.json({ ok: true, sent: false, marked: true });
  }

  if (!email || !subject || !body) {
    return NextResponse.json({ error: "email, subject, body required" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass) {
    return NextResponse.json({ error: "GMAIL creds not set" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `August - KindCodex <${user}>`,
      to: String(email),
      subject: String(subject),
      text: String(body),
      html: String(body).replace(/\n/g, "<br/>"),
      replyTo: user,
    });
  } catch (e) {
    transporter.close();
    return NextResponse.json({ error: "send failed: " + (e as Error).message }, { status: 500 });
  }
  transporter.close();

  await updateLead(String(email), {
    REPLY_HANDLED: true,
    STAGE: stage ? String(stage) : "replied",
  } as never);

  return NextResponse.json({ ok: true, sent: true });
}
