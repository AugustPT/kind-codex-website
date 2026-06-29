import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAllContacts, updateLead } from "@/lib/brevo";
import { gmailSync } from "@/lib/gmailSync";
import { gradeSync } from "@/lib/grader";
import { followupEmail } from "@/lib/followupTemplates";
import queue from "@/data/outreach-queue.json";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Daily cold-outreach engine (Vercel Cron, weekday 8am HST). Sends first touches
// AND automated follow-ups (#2, #3) — but auto-STOPS the moment a prospect replies.
// Before sending, it re-syncs replies from the inbox so a fresh reply always wins.
// Pause anytime with OUTREACH_ENABLED=false.

const DAILY_LIMIT = 10;          // total sends/day (first touches + follow-ups)
const FOLLOWUP_DAYS = 3;         // days between touches
const MAX_STEP = 3;              // 1 first touch + 2 follow-ups
const SPACING_MS = 2500;
const STOP_STAGES = new Set(["replied", "won", "dead"]); // never email these again

type QueueItem = { email: string; name: string; company: string; funnel: string; subject: string; body: string };

const norm = (e: string) => String(e || "").toLowerCase().trim();
const daysSince = (iso: string) => {
  const t = Date.parse(iso);
  return isNaN(t) ? Infinity : (Date.now() - t) / 86_400_000;
};

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  // Fail CLOSED: if the secret isn't configured, refuse rather than run wide open.
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const force = url.searchParams.get("force") === "1"; // bypass the daily cap for manual runs
  if (process.env.OUTREACH_ENABLED === "false") {
    return NextResponse.json({ ok: true, paused: true, sent: 0 });
  }

  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass) {
    return NextResponse.json({ error: "GMAIL_USER / GMAIL_APP_PASSWORD not set" }, { status: 500 });
  }

  // 1) Refresh reply status from the inbox so a just-arrived reply stops any follow-up today.
  //    Also score any Lead-Response Grader leads who replied to their sample inquiry.
  if (!dry) {
    try { await gmailSync(); } catch { /* non-fatal */ }
    try { await gradeSync(); } catch { /* non-fatal */ }
  }

  // 2) Current state per prospect from the CRM.
  const items = queue as QueueItem[];
  const contacts = await getAllContacts();
  const state = new Map<string, { stage: string; step: number; lastSent: string }>();
  for (const c of contacts) {
    const a = c.attributes || {};
    const rec = { stage: norm(a.STAGE || ""), step: Number(a.OUTREACH_STEP || 0), lastSent: String(a.OUTREACH_LAST_SENT || "") };
    if (c.email) state.set(norm(c.email), rec);
    const ce = norm(a.CONTACT_EMAIL || "");
    if (ce) state.set(ce, rec);
  }

  const followups: { item: QueueItem; nextStep: number }[] = [];
  const firsts: { item: QueueItem; nextStep: number }[] = [];
  for (const item of items) {
    const s = state.get(norm(item.email)) || { stage: "", step: 0, lastSent: "" };
    if (STOP_STAGES.has(s.stage)) continue;            // replied/won/dead → stop forever
    if (s.stage === "sent") {
      // Already contacted. Treat a missing step as 1 so a record promoted by gmailSync
      // (STAGE=sent, step=0) gets a FOLLOW-UP next — never a duplicate cold first-touch.
      const cur = Math.max(1, s.step);
      if (cur < MAX_STEP && daysSince(s.lastSent) >= FOLLOWUP_DAYS) {
        followups.push({ item, nextStep: cur + 1 });
      }
    } else if (!s.step) {
      firsts.push({ item, nextStep: 1 });              // never touched → first email
    }
  }

  // Idempotency: cap TOTAL sends per HST calendar day. A duplicate trigger (e.g. a stray
  // cron firing alongside the Windows task, or a manual re-run) then no-ops instead of
  // pushing past the deliverability ceiling. ?force=1 overrides for intentional manual runs.
  const todayHST = new Date().toLocaleDateString("en-CA", { timeZone: "Pacific/Honolulu" });
  let sentTodayCount = 0;
  for (const c of contacts) {
    const a = c.attributes || {};
    if (String(a.PIPELINE || "") !== "outbound") continue;
    const t = Date.parse(String(a.OUTREACH_LAST_SENT || ""));
    if (!isNaN(t) && new Date(t).toLocaleDateString("en-CA", { timeZone: "Pacific/Honolulu" }) === todayHST) {
      sentTodayCount++;
    }
  }
  const remainingToday = force ? DAILY_LIMIT : Math.max(0, DAILY_LIMIT - sentTodayCount);

  // Follow-ups first (they convert better), then new first-touches, up to the remaining cap.
  const batch = [...followups, ...firsts].slice(0, remainingToday);

  if (dry) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      queueTotal: items.length,
      alreadySentToday: sentTodayCount,
      remainingToday,
      eligibleFollowups: followups.length,
      eligibleFirstTouches: firsts.length,
      wouldSendNow: batch.map((b) => `${b.item.name} <${b.item.email}> (touch #${b.nextStep})`),
    });
  }

  // Daily cap already met (a trigger already ran today) → no-op cleanly.
  if (!batch.length) {
    return NextResponse.json({ ok: true, sent: 0, alreadySentToday: sentTodayCount, dailyCapReached: remainingToday === 0 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const sent: string[] = [];
  const errors: string[] = [];
  const today = new Date().toISOString();
  for (const { item, nextStep } of batch) {
    try {
      let subject = item.subject;
      let body = item.body;
      if (nextStep >= 2) {
        const f = followupEmail(nextStep, item);
        subject = f.subject;
        body = f.body;
      }
      await transporter.sendMail({
        from: `August - KindCodex <${user}>`,
        to: item.email,
        subject,
        text: body,
        html: body.replace(/\n/g, "<br/>"),
        replyTo: user,
      });
      const wrote = await updateLead(item.email, {
        STAGE: "sent",
        OUTREACH_STEP: nextStep,
        OUTREACH_LAST_SENT: today,
      });
      if (wrote) {
        sent.push(`${item.email} (#${nextStep})`);
      } else {
        // Email already went out but the CRM didn't record it. Surface loudly so it can be
        // marked by hand, and DON'T count it as sent — but it must not silently re-send.
        errors.push(`${item.email}: SENT but CRM write FAILED — mark manually to avoid a resend`);
      }
    } catch (e) {
      errors.push(`${item.email}: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, SPACING_MS));
  }
  transporter.close();

  return NextResponse.json({
    ok: true,
    sent: sent.length,
    sentDetail: sent,
    alreadySentToday: sentTodayCount,
    remainingFirstTouch: firsts.length - sent.filter((s) => s.endsWith("#1)")).length,
    errors: errors.slice(0, 10),
  });
}
