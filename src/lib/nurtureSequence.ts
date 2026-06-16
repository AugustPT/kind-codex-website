// The automated follow-up sequence. The cron advances each lead through these
// stages (by days since signup) until they book a call or finish the sequence.

export interface NurtureParams {
  firstName: string;
  source: string; // "never-miss-a-lead" | "sort-my-leads" | other
  result?: string; // the audit headline they got
  bookingUrl: string;
}

export interface NurtureStage {
  minDays: number; // send once this many days have passed since signup
  subject: (p: NurtureParams) => string;
  html: (p: NurtureParams) => string;
}

const isSort = (s: string) => s === "sort-my-leads";

// Shared email shell — light KindCodex styling.
function shell(bodyHtml: string, bookingUrl: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:540px;margin:0 auto;color:#1c1917;line-height:1.6;font-size:15px">
<div style="font-weight:700;font-size:18px;margin-bottom:18px">KindCodex<span style="color:#c2410c">.</span></div>
${bodyHtml}
<div style="margin:26px 0">
<a href="${bookingUrl}" style="background:#c2410c;color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:8px;display:inline-block">Book your 15-minute call</a>
</div>
<div style="color:#8a8a93;font-size:12px;border-top:1px solid #e7e5e4;padding-top:14px;margin-top:24px">
KindCodex · Honolulu, HI · You got this because you took our lead audit. Reply STOP to opt out.
</div></div>`;
}

// One-tap reply questionnaire. Each option is a mailto link that opens the
// recipient's mail app with the answer pre-filled — they tap and hit send.
// Goal: a real reply (huge deliverability signal) + one more data point.
const REPLY_TO = process.env.BREVO_SENDER_EMAIL || "august@kindcodex.com";

function questionnaire(p: NurtureParams): string {
  const q = isSort(p.source)
    ? {
        question: "One quick question — which sounds most like your pipeline right now?",
        options: [
          { label: "A) Good leads get buried with the tire-kickers", answer: "A — Good leads get buried with the tire-kickers" },
          { label: "B) I sort leads/applicants by hand and it eats my time", answer: "B — I sort by hand and it eats my time" },
          { label: "C) I've got it handled — just curious", answer: "C — Got it handled, just curious" },
        ],
      }
    : {
        question: "One quick question — which is closest to your setup right now?",
        options: [
          { label: "A) Leads come in but follow-up is hit or miss", answer: "A — Follow-up is hit or miss" },
          { label: "B) I lose track of leads across texts, inbox & portals", answer: "B — I lose track of leads everywhere" },
          { label: "C) I've got it handled — just curious", answer: "C — Got it handled, just curious" },
        ],
      };

  const btns = q.options
    .map((o) => {
      const href = `mailto:${REPLY_TO}?subject=${encodeURIComponent("Quick answer")}&body=${encodeURIComponent(o.answer)}`;
      return `<a href="${href}" style="display:block;text-align:center;padding:13px 14px;margin:8px 0;border:1px solid #c2410c;border-radius:10px;color:#c2410c;text-decoration:none;font-weight:600;font-size:14px">${o.label}</a>`;
    })
    .join("");

  return `<div style="margin:20px 0;padding:16px;background:#faf9f5;border:1px solid #e7e5e4;border-radius:12px">
<p style="margin:0 0 4px;font-weight:700">${q.question}</p>
<p style="margin:0 0 12px;font-size:13px;color:#8a8a93">Tap the one that fits and hit send — takes 2 seconds, and I'll point you to the right fix.</p>
${btns}</div>`;
}

const OFFER_LINE =
  `Quick reminder on how it works: I build it for you free, you run it free for 30 days, ` +
  `and only if it's making you money and you want to keep it is it $1,000/mo. If it's not, ` +
  `we shut it off and you owe nothing.`;

export const NURTURE_SEQUENCE: NurtureStage[] = [
  // Stage 0 — immediate (result + invite)
  {
    minDays: 0,
    subject: (p) =>
      isSort(p.source)
        ? `${p.firstName}, here's where your time is leaking`
        : `${p.firstName}, here's where your leads are leaking`,
    html: (p) =>
      shell(
        `<p>Hey ${p.firstName},</p>
<p>Thanks for taking the audit. ${
          p.result ? `Your result: <strong>${p.result}</strong>.` : ""
        }</p>
<p>${
          isSort(p.source)
            ? `The short version: you're sorting leads by hand, so your best buyers wait while you work through the rest. That's deals slipping and hours gone.`
            : `The short version: leads are coming in faster than they can be caught, and the ones that sit go cold. Every missed lead is a commission you already paid to generate.`
        }</p>
<p>I build a simple system that fixes exactly that.</p>
${questionnaire(p)}
<p style="font-size:14px;color:#57534e">Prefer to just talk it through? Grab a 15-minute call below and I'll show you exactly how the fix works.</p>`,
        p.bookingUrl
      ),
  },
  // Stage 1 — day 1 (the cost)
  {
    minDays: 1,
    subject: () => `What one slipped lead actually costs you`,
    html: (p) =>
      shell(
        `<p>Hey ${p.firstName},</p>
<p>One lead that goes cold isn't a small thing — it's a $10k–$30k commission you already paid to generate, gone quietly.</p>
<p>${
          isSort(p.source)
            ? `When your pipeline isn't sorted, the good ones get buried with the tire-kickers. The fix is a system that surfaces your best leads first, automatically.`
            : `When there's no system catching every lead the second it lands, a few always slip. The fix is a system that grabs them instantly and won't let one go cold.`
        }</p>
<p>${OFFER_LINE}</p>`,
        p.bookingUrl
      ),
  },
  // Stage 2 — day 3 (what we build)
  {
    minDays: 3,
    subject: () => `Here's exactly what I'd set up for you`,
    html: (p) =>
      shell(
        `<p>Hey ${p.firstName},</p>
<p>No mystery — here's what the build looks like:</p>
<ul>
${
  isSort(p.source)
    ? `<li>Every new lead scored against your rules the moment it lands</li>
<li>Sorted into ready / not-yet / not-a-fit automatically</li>
<li>Your hottest leads surfaced to the top of your day</li>
<li>"Maybe later" leads kept warm instead of forgotten</li>`
    : `<li>Every lead from every source captured the second it comes in</li>
<li>An instant alert so you're first to respond</li>
<li>One organized place for all of them — no more lost texts</li>
<li>Follow-up reminders so nothing goes cold</li>`
}
</ul>
<p>It's built around how <em>you</em> already work. 15 minutes and I'll map it to your exact setup.</p>`,
        p.bookingUrl
      ),
  },
  // Stage 3 — day 6 (still happening?)
  {
    minDays: 6,
    subject: (p) => `${p.firstName}, still losing leads this week?`,
    html: (p) =>
      shell(
        `<p>Hey ${p.firstName},</p>
<p>If this week looked like most — a couple leads came in while you were showing a house or on another call, and you're not 100% sure they got followed up.</p>
<p>That's the exact gap this closes. And remember, there's zero risk to find out: ${OFFER_LINE.toLowerCase()}</p>
<p>Worth 15 minutes?</p>`,
        p.bookingUrl
      ),
  },
  // Stage 4 — day 10 (last nudge)
  {
    minDays: 10,
    subject: () => `Last one from me`,
    html: (p) =>
      shell(
        `<p>Hey ${p.firstName},</p>
<p>I won't keep emailing — this is the last one.</p>
<p>If catching (and keeping) every lead matters to you this year, the call's still open and the offer still stands: free to build, free for 30 days, owe nothing if it doesn't work.</p>
<p>If now's not the time, no worries at all. Whenever you're ready, the link's below.</p>`,
        p.bookingUrl
      ),
  },
];

export const MAX_STAGE = NURTURE_SEQUENCE.length; // sequence complete when NURTURE_STAGE >= this
