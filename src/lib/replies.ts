import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

// Reads the user's Gmail INBOX over IMAP and returns the latest inbound message
// body from each address in `fromEmails` (the prospect set). Used to feed the
// AI reply assistant. Read-only — never sends or deletes.

export interface CapturedReply {
  fromEmail: string;
  text: string;
  subject: string;
  at: string; // ISO
}

export async function scanReplies(
  fromEmails: Set<string>,
  sinceDays = 30
): Promise<Map<string, CapturedReply>> {
  const out = new Map<string, CapturedReply>();
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass || fromEmails.size === 0) return out;

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
  } catch {
    return out;
  }

  const since = new Date(Date.now() - sinceDays * 86_400_000);
  let lock: any;
  try {
    lock = await client.getMailboxLock("INBOX");
    const uids = (await client.search({ since }, { uid: true })) || [];
    if (!uids.length) return out;
    // newest first so the first match per address is the latest
    uids.sort((a: number, b: number) => b - a);
    for await (const msg of client.fetch(uids, { envelope: true, source: true }, { uid: true })) {
      const from = String((msg as any).envelope?.from?.[0]?.address || "").toLowerCase().trim();
      if (!from || !fromEmails.has(from) || out.has(from)) continue;
      let text = "";
      let subject = String((msg as any).envelope?.subject || "");
      try {
        const parsed = await simpleParser((msg as any).source);
        const htmlText = typeof parsed.html === "string" ? parsed.html.replace(/<[^>]+>/g, " ") : "";
        text = (parsed.text || htmlText || "").trim();
        if (parsed.subject) subject = parsed.subject;
      } catch {
        text = "";
      }
      // strip quoted history so the AI sees just their new words
      text = stripQuoted(text);
      const at =
        ((msg as any).envelope?.date && new Date((msg as any).envelope.date).toISOString()) ||
        new Date().toISOString();
      out.set(from, { fromEmail: from, text, subject, at });
    }
  } catch {
    // ignore; return whatever we have
  } finally {
    if (lock) lock.release();
    await client.logout().catch(() => {});
  }

  return out;
}

// Drop the quoted "On ... wrote:" history and signatures-ish trailing blocks.
function stripQuoted(body: string): string {
  if (!body) return "";
  const lines = body.split(/\r?\n/);
  const kept: string[] = [];
  for (const line of lines) {
    if (/^On .+wrote:$/i.test(line.trim())) break;
    if (/^-{2,}\s*Original Message/i.test(line.trim())) break;
    if (line.trim() === ">" || /^>{1,}/.test(line.trim())) continue;
    kept.push(line);
  }
  return kept.join("\n").trim().slice(0, 4000);
}
