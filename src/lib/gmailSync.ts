import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { getAllContacts, updateLead, type LeadAttributes } from "./brevo";
import { sendGradeLink, GRADE_REQUEST_RE } from "./grader";

// Server-side Gmail sync: scans Sent + Inbox via IMAP (app password) and advances
// outbound prospects in the CRM — "sent" when you email them, "replied" when they
// answer. Runs from the daily cron. No Apps Script / OAuth needed.

const STAGE_ORDER = ["researched", "drafted", "sent", "replied", "won"];

function addrList(addrs: any): string[] {
  if (!addrs) return [];
  const arr = Array.isArray(addrs) ? addrs : [addrs];
  return arr.map((a: any) => String(a?.address || "").trim().toLowerCase()).filter(Boolean);
}

// Auto-responders (ticketing acks, out-of-office, vacation, "do not reply",
// bounce/delivery notices) are NOT real replies. They must not flip a prospect
// to "replied" — that would silently stop their follow-up sequence. Detect them
// from the subject + RFC-3834 headers and skip.
const AUTO_SUBJECT =
  /(out of (the )?office|automatic reply|auto[\s-]?reply|auto[\s-]?response|autoresponder|on vacation|currently (away|out)|away from (the )?office|ticket (has been )?created|case (has been )?(opened|created)|we('| ha)ve received your (request|inquiry|message|email)|thank you for contacting|do not reply|no[\s-]?reply|undeliverable|delivery (status|failure|has failed)|returned mail|read receipt|read:)/i;

function isAutoReply(msg: any): boolean {
  const subj = String(msg?.envelope?.subject || "");
  if (AUTO_SUBJECT.test(subj)) return true;
  const hdr = (msg?.headers ? msg.headers.toString() : "").toLowerCase();
  if (/auto-submitted:\s*(auto-replied|auto-generated|auto-notified)/.test(hdr)) return true;
  if (/precedence:\s*(bulk|auto_reply|junk|list)/.test(hdr)) return true;
  if (/x-auto(reply|respond|-response-suppress|generated)/.test(hdr)) return true;
  if (/x-failed-recipients:/.test(hdr)) return true;
  return false;
}

// Opt-out / not-interested intent in a prospect's OWN words → permanent suppression.
// Kept high-precision on purpose: better to leave a soft "maybe" in the review queue
// (August marks it by hand) than to auto-kill a real lead. Checked only against the
// prospect's NEW text (quoted history stripped first) so our cold email's own
// "Not a fit? just reply and I'll leave you be" P.S. can never false-trigger.
const SUPPRESS_RE =
  /\b(unsubscribe|opt[\s-]?out|remove me|take (?:me|us) off|please remove|stop (?:emailing|contacting|messaging|sending|reaching)|please stop|do not (?:contact|email|reach)|don'?t (?:contact|email|reach)|leave me alone|not interested|no,? thank|no thanks)\b/i;

// Drop quoted reply history so we only read what the prospect newly wrote.
function newWords(body: string): string {
  if (!body) return "";
  const kept: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (/^On .+wrote:$/i.test(t)) break;
    if (/^-{2,}\s*Original Message/i.test(t)) break;
    if (/^_{5,}$/.test(t)) break; // Outlook divider
    if (t === ">" || /^>{1,}/.test(t)) continue;
    kept.push(line);
  }
  return kept.join("\n").trim();
}

// Classify a prospect's reply from their OWN new words. Opt-out always wins over a grade
// request. "normal" = a genuine reply that should stop the sequence (STAGE=replied).
async function replyIntent(source: any, subject: string): Promise<"optout" | "grade" | "normal"> {
  let text = "";
  try {
    const parsed = await simpleParser(source);
    const html = typeof parsed.html === "string" ? parsed.html.replace(/<[^>]+>/g, " ") : "";
    text = String(parsed.text || html || "");
  } catch {
    text = "";
  }
  const words = newWords(text).slice(0, 2000);
  const subj = String(subject || "");
  if (SUPPRESS_RE.test(words) || SUPPRESS_RE.test(subj)) return "optout";
  if (GRADE_REQUEST_RE.test(words)) return "grade";
  return "normal";
}

export async function gmailSync(): Promise<{
  sent: number;
  replied: number;
  unsubscribed: number;
  gradeLinks: number;
  mapped: number;
  scanned: number;
  errors: string[];
}> {
  const out = { sent: 0, replied: 0, unsubscribed: 0, gradeLinks: 0, mapped: 0, scanned: 0, errors: [] as string[] };
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass) {
    out.errors.push("GMAIL_USER / GMAIL_APP_PASSWORD not set");
    return out;
  }

  // Map prospect CONTACT_EMAIL -> { brevo key, current stage, booked }
  const contacts = await getAllContacts();
  const byEmail = new Map<string, { key: string; name: string; stage: string; step: number; booked: boolean }>();
  for (const c of contacts) {
    const a = c.attributes || {};
    const ce = String(a.CONTACT_EMAIL || "").trim().toLowerCase();
    if (ce) {
      byEmail.set(ce, {
        key: c.email,
        name: String(a.FIRSTNAME || a.COMPANY || ""),
        stage: String(a.STAGE || "drafted").toLowerCase(),
        step: Number(a.OUTREACH_STEP || 0),
        booked: a.BOOKED === true,
      });
    }
  }
  out.mapped = byEmail.size;
  if (byEmail.size === 0) return out;

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
  } catch (e) {
    out.errors.push("imap connect: " + (e as Error).message);
    return out;
  }

  const since = new Date(Date.now() - 21 * 86_400_000); // last 21 days

  async function scan(
    mailbox: string,
    pick: (env: any) => string[],
    newStage: string,
    skipAuto = false,
  ) {
    let lock: any;
    try {
      lock = await client.getMailboxLock(mailbox);
    } catch (e) {
      out.errors.push(`open ${mailbox}: ${(e as Error).message}`);
      return;
    }
    try {
      const uids = (await client.search({ since }, { uid: true })) || [];
      out.scanned += uids.length;
      if (!uids.length) return;
      for await (const msg of client.fetch(
        uids,
        { envelope: true, headers: skipAuto, source: skipAuto },
        { uid: true },
      )) {
        if (skipAuto && isAutoReply(msg as any)) continue;
        // Classify the inbound message once (opt-out vs grade-request vs normal reply).
        let intent: "optout" | "grade" | "normal" | null = null;
        for (const e of pick((msg as any).envelope)) {
          const p = byEmail.get(e);
          if (!p || p.booked) continue;
          if (skipAuto) {
            if (intent === null) {
              intent = await replyIntent((msg as any).source, (msg as any)?.envelope?.subject || "");
            }
            // Opt-out / not-interested → permanent suppression (STAGE=dead). Beats the stage-order
            // guard so even an already-"replied" decline gets corrected; never downgrade a "won".
            if (intent === "optout") {
              if (p.stage !== "dead" && p.stage !== "won") {
                await updateLead(p.key, { STAGE: "dead", REPLY_HANDLED: true } as LeadAttributes);
                p.stage = "dead";
                out.unsubscribed++;
              }
              continue;
            }
            // Grade request ("SCORE") → auto-send the free Grader link and stop the cold sequence.
            if (intent === "grade") {
              if (p.stage !== "dead" && p.stage !== "won") {
                try { await sendGradeLink(e, p.name); } catch { /* non-fatal */ }
                await updateLead(p.key, { STAGE: "replied", REPLY_HANDLED: true } as LeadAttributes);
                p.stage = "replied";
                out.gradeLinks++;
              }
              continue;
            }
          }
          if (STAGE_ORDER.indexOf(newStage) <= STAGE_ORDER.indexOf(p.stage)) continue;
          // When we detect a SENT email, stamp the activity fields too — otherwise the
          // record has STAGE=sent but OUTREACH_STEP=0 (so the engine re-cold-emails it)
          // and no OUTREACH_LAST_SENT (so the dashboard can't count it). Use the message's
          // own date so follow-up spacing stays correct. Don't touch these on a "replied".
          const patch: LeadAttributes = { STAGE: newStage };
          if (newStage === "sent") {
            patch.OUTREACH_STEP = Math.max(p.step, 1);
            const d = (msg as any)?.envelope?.date;
            patch.OUTREACH_LAST_SENT = (d ? new Date(d) : new Date()).toISOString();
          }
          await updateLead(p.key, patch);
          p.stage = newStage;
          if (newStage === "sent") out.sent++;
          else out.replied++;
        }
      }
    } catch (e) {
      out.errors.push(`scan ${mailbox}: ${(e as Error).message}`);
    } finally {
      if (lock) lock.release();
    }
  }

  try {
    await scan("[Gmail]/Sent Mail", (env) => addrList(env?.to), "sent");
    await scan("INBOX", (env) => addrList(env?.from), "replied", true);
  } finally {
    await client.logout().catch(() => {});
  }

  return out;
}
