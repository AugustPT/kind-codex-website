// The Lead-Response Grader — KindCodex's pull-funnel ("turn on the lights").
// A realtor consents to be graded; we email them a sample buyer inquiry from our
// testing address, they reply as they would to a real lead, and we clock the gap.
// The score IS the wound (slow reply = lost deals); the 60-second invisible system
// is the cure. Reuses the Gmail SMTP + IMAP plumbing already used for outreach.
import { ImapFlow } from "imapflow";
import { getAllContacts, updateLead, sendEmail } from "./brevo";

// IMAP creds for reading replies. Outbound now goes through Brevo (sendEmail) — a real
// deliverability-grade ESP that's DKIM-authenticated for kindcodex.com — instead of raw
// Gmail SMTP from a low-reputation new domain (which was landing the test in spam). Replies
// are routed back to this Gmail inbox via replyTo so scoring still works.
function gmail() {
  return { user: process.env.GMAIL_USER || "", pass: (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "") };
}
const REPLY_INBOX = () => process.env.GMAIL_USER || undefined;

export const TEST_SUBJECT = "Is this property still available?";

// A prospect replying to a cold follow-up with one of these is asking for their free grade.
export const GRADE_REQUEST_RE = /\b(score|grade me|grade my|send it|send me|i'?m in|i'?m interested|interested|sounds good|yes please|let'?s do it)\b/i;

export function testInquiryBody(name: string): string {
  const first = (name || "").trim().split(/\s+/)[0];
  return `Hi${first ? " " + first : ""},

I came across one of your listings and I'm really interested. Is it still available, and could we find a time to see it this week? Also, what's the asking price?

Thanks,
Jordan`;
}

function fmt(min: number): string {
  if (min < 1) return "under a minute";
  if (min < 60) return `${Math.round(min)} minutes`;
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  return `${h}h${m ? ` ${m}m` : ""}`;
}

export interface Score {
  grade: string;
  band: "elite" | "good" | "fair" | "slow";
  headline: string;
  context: string; // honest, encouraging context — not shame
  tip: string; // a genuinely useful tip they can use today, with or without us
  cure: string; // how KindCodex could help, offered (not pushed)
  minutes: number;
}

// Honest, helpful scoring. The goal is to genuinely help an agent respond faster —
// not to embarrass anyone into a sale. Every tier gets a real grade, encouraging
// context, and a free tip they can act on today.
export function scoreFor(minutes: number): Score {
  const t = fmt(minutes);
  if (minutes <= 5)
    return {
      grade: "A+", band: "elite", minutes,
      headline: `You replied in ${t} — genuinely excellent.`,
      context: "Fast first replies are the single biggest edge an agent can have, and you've got it. Nice work.",
      tip: "Keep a couple of warm, ready-to-send opener templates so a quick reply never costs you thinking time.",
      cure: "The only hard part is keeping this up on every lead, nights and weekends included. That's the piece we make automatic, so you can keep your A+ without living on your phone.",
    };
  if (minutes <= 60)
    return {
      grade: "A-", band: "good", minutes,
      headline: `You replied in ${t} — that's responsive, solid work.`,
      context: "You're ahead of most. Research suggests the first ~5 minutes is the real sweet spot, so there's a little room to tighten the very first touch.",
      tip: "Set a simple auto-acknowledgment on your contact form ('Got it, I'll be right with you') so leads feel seen instantly while you finish what you're doing.",
      cure: "We can make that first reply land in seconds and still sound like you, so you're never the slower option, even mid-showing.",
    };
  if (minutes <= 240)
    return {
      grade: "B", band: "fair", minutes,
      headline: `You replied in ${t} — and there's a real, easy win here.`,
      context: "This is completely normal when you're busy showing homes. It's also one of the most fixable things in the business: buyers often reach out to a few agents and tend to go with whoever answers first.",
      tip: "Even without any tools: a saved text/email template plus phone notifications turned on for your lead sources can cut your response time a lot this week.",
      cure: "An instant, friendly auto-reply would keep these leads warm until you can personally call, so a busy afternoon never costs you one.",
    };
  return {
    grade: "C", band: "slow", minutes,
    headline: `Your reply came in around ${t}.`,
    context: "Honestly, this is what happens to almost every busy agent. No judgment. It's also the highest-leverage thing you could improve, because a fast first touch genuinely wins more clients.",
    tip: "Quickest free fix: forward your website/Zillow leads to a number with push notifications on, and keep one ready-to-send reply you can fire in two taps.",
    cure: "This is exactly what we build: a 60-second auto-reply that catches every lead for you, even at 2am or mid-showing, so a slow day never costs you a client.",
  };
}

// Send the consensual sample inquiry via Brevo. Returns the ISO timestamp that starts the clock.
export async function sendGradeTest(email: string, name: string): Promise<string> {
  const body = testInquiryBody(name);
  const res = await sendEmail({
    to: email,
    toName: name || undefined,
    subject: TEST_SUBJECT,
    html: body.replace(/\n/g, "<br/>"),
    text: body,
    replyTo: REPLY_INBOX(),
  });
  if (!res.ok) throw new Error(res.detail || "grade test send failed");
  return new Date().toISOString();
}

function scoreEmailHtml(name: string, s: Score): string {
  const first = (name || "").trim().split(/\s+/)[0] || "there";
  const accent = s.band === "elite" ? "#15803d" : "#c2410c";
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1c1917">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:24px 12px"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #e7e5e4;border-top:3px solid #c2410c;border-radius:16px;overflow:hidden;text-align:left">
    <tr><td style="padding:22px 32px;border-bottom:1px solid #f5f5f4;font-size:18px;font-weight:700">KindCodex<span style="color:#c2410c">.</span></td></tr>
    <tr><td style="padding:30px 32px 8px">
      <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#a8a29e">Your lead-response score</div>
      <div style="font-family:Georgia,serif;font-size:84px;font-weight:700;line-height:1;color:${accent};margin:6px 0 4px">${s.grade}</div>
      <h1 style="margin:8px 0 14px;font-size:21px;font-weight:700;line-height:1.25;color:#1c1917">${s.headline}</h1>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#57534e">Hi ${first}, thanks for trying this. We sent a sample buyer inquiry to your inbox and timed your reply. ${s.context}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;border:1px solid #e7e5e4;border-radius:12px;margin:0 0 22px"><tr><td style="padding:16px 18px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#c2410c;margin-bottom:6px">One quick win you can use today</div>
        <div style="font-size:14px;line-height:1.6;color:#1c1917">${s.tip}</div>
      </td></tr></table>
      <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#1c1917">${s.cure}</p>
      <a href="https://kindcodex.com/demo?ref=grader" style="display:inline-block;background:#c2410c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:10px">See how it works →</a>
      <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#78716c">No pressure at all — if it's helpful, reply and I'll show you how it'd work for your listings. If not, you've got the tip above for free. — August, KindCodex (Honolulu)</p>
    </td></tr>
    <tr><td style="padding:20px 32px;background:#faf9f5;border-top:1px solid #e7e5e4;text-align:center;font-size:11px;color:#a8a29e">Invisible systems. Visible results. · kindcodex.com</td></tr>
  </table></td></tr></table></body></html>`;
}

// When a cold prospect replies asking for their grade, send them the (consensual) link.
export async function sendGradeLink(email: string, name: string): Promise<void> {
  const first = (name || "").trim().split(/\s+/)[0] || "there";
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1c1917">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:24px 12px"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border:1px solid #e7e5e4;border-top:3px solid #c2410c;border-radius:16px;text-align:left">
    <tr><td style="padding:22px 30px;border-bottom:1px solid #f5f5f4;font-size:18px;font-weight:700">KindCodex<span style="color:#c2410c">.</span></td></tr>
    <tr><td style="padding:28px 30px">
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hi ${first}, love it. Here's your free 60-second lead-response check — it times how fast you reply to a sample buyer inquiry and gives you one tip to improve it. No pitch.</p>
      <a href="https://kindcodex.com/grade?ref=outreach" style="display:inline-block;background:#c2410c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:10px">Get my free score →</a>
      <p style="margin:18px 0 0;font-size:13px;color:#78716c">Takes 30 seconds. — August, KindCodex (Honolulu)</p>
    </td></tr>
  </table></td></tr></table></body></html>`;
  await sendEmail({
    to: email,
    toName: name || undefined,
    subject: "Your free lead-response check",
    html,
    text: `Hi ${first}, here's your free 60-second lead-response check (plus a tip): https://kindcodex.com/grade?ref=outreach — August, KindCodex`,
    replyTo: REPLY_INBOX(),
  });
}

async function sendScoreEmail(email: string, name: string, s: Score): Promise<void> {
  await sendEmail({
    to: email,
    toName: name || undefined,
    subject: `Your lead-response score: ${s.grade} — plus a quick win`,
    html: scoreEmailHtml(name, s),
    text: `${s.headline}\n\n${s.context}\n\nOne quick win you can use today: ${s.tip}\n\n${s.cure}\n\nSee how it works: https://kindcodex.com/demo?ref=grader\n- August, KindCodex`,
    replyTo: REPLY_INBOX(),
  });
}

interface Waiting { key: string; name: string; sentAt: number; }

function collectWaiting(contacts: { email: string; attributes: Record<string, any> }[]): Map<string, Waiting> {
  const waiting = new Map<string, Waiting>();
  for (const c of contacts) {
    const a = c.attributes || {};
    if (String(a.PIPELINE || "").toLowerCase() !== "grader") continue;
    if (String(a.STAGE || "").toLowerCase() !== "grader") continue; // already "graded" → skip
    const ce = String(a.CONTACT_EMAIL || c.email || "").toLowerCase().trim();
    const sentAt = Date.parse(String(a.SIGNUP_TS || ""));
    if (ce && !isNaN(sentAt)) waiting.set(ce, { key: c.email, name: String(a.FIRSTNAME || ""), sentAt });
  }
  return waiting;
}

// For each grader contact awaiting a score, look for their reply to the sample inquiry,
// clock it, email the score, and mark them graded. Returns how many were scored.
// `onlyEmail` limits the scan to one address (used by the live status poll).
export async function gradeSync(onlyEmail?: string): Promise<{ checked: number; scored: number; lastScore?: Score; errors: string[] }> {
  const out = { checked: 0, scored: 0, lastScore: undefined as Score | undefined, errors: [] as string[] };
  const scoredEmails = new Set<string>();
  const { user, pass } = gmail();
  if (!user || !pass) { out.errors.push("GMAIL creds not set"); return out; }

  const contacts = await getAllContacts();
  let waiting = collectWaiting(contacts);
  if (onlyEmail) {
    const e = onlyEmail.toLowerCase().trim();
    waiting = new Map([...waiting].filter(([k]) => k === e));
  }
  out.checked = waiting.size;
  if (!waiting.size) return out;

  const client = new ImapFlow({ host: "imap.gmail.com", port: 993, secure: true, auth: { user, pass }, logger: false });
  try { await client.connect(); } catch (e) { out.errors.push("imap connect: " + (e as Error).message); return out; }
  let lock: any;
  try {
    lock = await client.getMailboxLock("INBOX");
    const since = new Date(Date.now() - 14 * 86_400_000);
    const uids = (await client.search({ since }, { uid: true })) || [];
    uids.sort((a: number, b: number) => a - b); // earliest first → first match per addr is the fastest reply
    const firstReply = new Map<string, number>();
    if (uids.length) {
      for await (const msg of client.fetch(uids, { envelope: true }, { uid: true })) {
        const from = String((msg as any).envelope?.from?.[0]?.address || "").toLowerCase().trim();
        const w = waiting.get(from);
        if (!w || firstReply.has(from)) continue;
        const at = (msg as any).envelope?.date ? new Date((msg as any).envelope.date).getTime() : 0;
        if (at && at >= w.sentAt) firstReply.set(from, at);
      }
    }
    for (const [email, w] of waiting) {
      const replyAt = firstReply.get(email);
      if (!replyAt) continue;
      const minutes = Math.max(0, (replyAt - w.sentAt) / 60_000);
      const s = scoreFor(minutes);
      try {
        await sendScoreEmail(email, w.name, s);
        await updateLead(w.key, { STAGE: "graded", AUDIT_RESULT: `${s.grade} · ${s.headline}`, OUTREACH_STEP: 1, OUTREACH_LAST_SENT: new Date().toISOString() } as never);
        out.scored++;
        out.lastScore = s;
        scoredEmails.add(email);
      } catch (e) {
        out.errors.push(`${email}: ${(e as Error).message}`);
      }
    }
  } catch (e) {
    out.errors.push("scan: " + (e as Error).message);
  } finally {
    if (lock) lock.release();
    await client.logout().catch(() => {});
  }
  // On the full daily run (not the single-email status poll): remind signups who never
  // replied to their sample (so no one falls through), then nudge graded-but-unbooked leads.
  if (!onlyEmail) {
    try { await graderReminders(contacts, scoredEmails); } catch { /* non-fatal */ }
    try { await gradeFollowups(contacts); } catch { /* non-fatal */ }
  }
  return out;
}

// Remind a grader signup who hasn't replied to their sample inquiry yet (one nudge), so the
// "I signed up but never got my score" gap can't strand a real lead.
async function graderReminders(contacts: { email: string; attributes: Record<string, any> }[], exclude: Set<string>): Promise<number> {
  const now = Date.now();
  let sent = 0;
  for (const c of contacts) {
    const a = c.attributes || {};
    if (String(a.PIPELINE || "").toLowerCase() !== "grader") continue;
    if (String(a.STAGE || "").toLowerCase() !== "grader") continue; // still awaiting a reply
    if (Number(a.OUTREACH_STEP || 0) >= 1) continue; // already reminded
    const email = String(a.CONTACT_EMAIL || c.email || "").toLowerCase();
    if (!email || exclude.has(email)) continue;
    const start = Date.parse(String(a.SIGNUP_TS || ""));
    if (isNaN(start) || now - start < 2 * 3_600_000) continue; // give them ~2 hours first
    const first = String(a.FIRSTNAME || "").trim().split(/\s+/)[0] || "there";
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1c1917">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:24px 12px"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border:1px solid #e7e5e4;border-top:3px solid #c2410c;border-radius:16px;text-align:left">
      <tr><td style="padding:22px 30px;border-bottom:1px solid #f5f5f4;font-size:18px;font-weight:700">KindCodex<span style="color:#c2410c">.</span></td></tr>
      <tr><td style="padding:28px 30px">
        <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hi ${first}, your lead-response score is just one reply away. To time it, I sent a sample buyer inquiry to this inbox (subject: <strong>&ldquo;Is this property still available?&rdquo;</strong>) — it&apos;s still unanswered, which is exactly the thing the check measures. No judgment, it happens to every busy agent.</p>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Just reply to that message like you would a real lead and I&apos;ll send your timed score right back. (If you don&apos;t see it, peek in spam — and that&apos;s a clue in itself.)</p>
        <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#57534e">Free tip either way: turn on push notifications for your website/Zillow leads and keep one friendly opener saved, so a new inquiry gets answered in seconds even mid-showing. Speed is the #1 thing that wins buyers.</p>
        <p style="margin:16px 0 0;font-size:13px;color:#78716c">No pressure at all. — August, KindCodex (Honolulu)</p>
      </td></tr>
    </table></td></tr></table></body></html>`;
    try {
      const res = await sendEmail({
        to: email,
        toName: first,
        subject: "Your score is one reply away",
        html,
        text: `Hi ${first}, your lead-response score is one reply away. Reply to the sample buyer inquiry I sent (subject: "Is this property still available?") and I'll send your timed score. Tip: turn on lead notifications + keep a saved opener so you can reply in seconds. - August, KindCodex`,
        replyTo: REPLY_INBOX(),
      });
      if (!res.ok) continue;
      await updateLead(c.email, { OUTREACH_STEP: 1, OUTREACH_LAST_SENT: new Date().toISOString() } as never);
      sent++;
      await new Promise((r) => setTimeout(r, 1500));
    } catch { /* skip this one */ }
  }
  return sent;
}

// One gentle, helpful follow-up to graded leads who haven't booked, ~2 days after their score.
async function gradeFollowups(contacts: { email: string; attributes: Record<string, any> }[]): Promise<number> {
  const now = Date.now();
  let sent = 0;
  for (const c of contacts) {
    const a = c.attributes || {};
    if (String(a.PIPELINE || "").toLowerCase() !== "grader") continue;
    if (String(a.STAGE || "").toLowerCase() !== "graded") continue; // scored, not yet nudged-out
    if (a.BOOKED === true) continue;
    if (Number(a.OUTREACH_STEP || 0) >= 2) continue; // already nudged once
    const last = Date.parse(String(a.OUTREACH_LAST_SENT || ""));
    if (isNaN(last) || now - last < 2 * 86_400_000) continue; // give them ~2 days first
    const email = String(a.CONTACT_EMAIL || c.email || "");
    if (!email) continue;
    const first = String(a.FIRSTNAME || "").trim().split(/\s+/)[0] || "there";
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1c1917">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:24px 12px"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border:1px solid #e7e5e4;border-top:3px solid #c2410c;border-radius:16px;text-align:left">
      <tr><td style="padding:22px 30px;border-bottom:1px solid #f5f5f4;font-size:18px;font-weight:700">KindCodex<span style="color:#c2410c">.</span></td></tr>
      <tr><td style="padding:28px 30px">
        <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hi ${first}, no pitch, just following up on your lead-response check. Responding faster is genuinely the easiest win in the business, and you don't have to live on your phone to do it.</p>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.6">If you ever want it handled automatically: I build the system for you free, you run it free for 30 days, and it's only $1,000/mo if it's actually winning you more clients. If not, we shut it off and you owe nothing.</p>
        <a href="https://kindcodex.com/demo?ref=grader-followup" style="display:inline-block;background:#c2410c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:10px">See how it works →</a>
        <p style="margin:18px 0 0;font-size:13px;color:#78716c">Or just reply and I'll answer any questions. — August, KindCodex (Honolulu)</p>
      </td></tr>
    </table></td></tr></table></body></html>`;
    try {
      const res = await sendEmail({
        to: email,
        toName: first,
        subject: "the easiest win in your business (no pitch)",
        html,
        text: `Hi ${first}, following up on your lead-response check. If you ever want it handled automatically: free build, free for 30 days, $1,000/mo only if it's winning you clients. See how: https://kindcodex.com/demo?ref=grader-followup — August, KindCodex`,
        replyTo: REPLY_INBOX(),
      });
      if (!res.ok) continue;
      await updateLead(c.email, { OUTREACH_STEP: 2, OUTREACH_LAST_SENT: new Date().toISOString() } as never);
      sent++;
      await new Promise((r) => setTimeout(r, 1500));
    } catch { /* skip this one */ }
  }
  return sent;
}
