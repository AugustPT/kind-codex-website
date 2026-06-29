// The "floor" tap-to-qualify email — works in 100% of email clients (iPhone Mail,
// Gmail, Outlook, etc). The first question's answers are real, bulletproof, tappable
// buttons IN the email; each is a deep link to /capture/<clientId>?q0=<value> so the
// buyer lands mid-flow and finishes the rest in taps on the page. No typing. The
// continuation page never mutates on the bare GET (deliverability-safe).

import type { ClientConfig } from "./clients";
import { encryptContact } from "./token";
import { Q1 } from "./qualifyFlow";

const SITE = "https://kindcodex.com";
const TERRA = "#c2410c";
const INK = "#1c1917";
const CREAM = "#faf9f5";

export interface QualifyEmailInput {
  client: ClientConfig;
  name?: string; // buyer
  email?: string; // buyer's email (we already have it) — carried as an encrypted token
  property?: string;
  intro?: string; // optional warm opener line (e.g. the AI's first sentence)
}

// One bulletproof, text-based button (VML for Outlook + anchor for everyone else).
function button(label: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 10px"><tr><td align="center" bgcolor="${TERRA}" style="border-radius:10px">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:46px;v-text-anchor:middle;width:300px;" arcsize="22%" fillcolor="${TERRA}" stroke="f"><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${label}</center></v:roundrect><![endif]-->
<!--[if !mso]><!-- --><a href="${href}" style="display:inline-block;padding:13px 22px;min-width:256px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;background:${TERRA}">${label}</a><!--<![endif]-->
</td></tr></table>`;
}

export function renderQualifierEmail(input: QualifyEmailInput): { subject: string; html: string; text: string } {
  const { client } = input;
  const name = (input.name || "").trim();
  const property = (input.property || "").trim();
  const agent = client.agentName || "the team";
  const base = `${SITE}/capture/${encodeURIComponent(client.id)}`;
  // Carry the known contact as an encrypted token (no plaintext PII in the URL).
  const token = encryptContact({ n: name || undefined, e: (input.email || "").trim() || undefined, p: property || undefined });
  const q = (val: string) =>
    `${base}?q0=${encodeURIComponent(val)}${token ? `&t=${token}` : ""}`;

  const subject = `Quick question${property ? ` about ${property}` : ""}`;

  const buttons = Q1.options.map((o) => button(o, q(o))).join("");
  const greeting = (input.intro || "").trim() || `Hi ${name || "there"}, thanks for reaching out${property ? ` about ${property}` : ""}. Happy to help fast.`;

  const html = `<div style="margin:0;padding:0;background:${CREAM}">
<div style="max-width:480px;margin:0 auto;padding:26px 22px;font-family:Arial,Helvetica,sans-serif;color:${INK}">
<p style="font-size:16px;line-height:1.5;margin:0 0 14px">${greeting}</p>
<p style="font-size:16px;line-height:1.5;margin:0 0 16px"><strong>${Q1.prompt}</strong> Just tap one, no typing:</p>
${buttons}
<p style="font-size:13px;line-height:1.5;color:#8a8a93;margin:18px 0 0">One tap and you'll get a real answer in seconds. Prefer to just reply to this email? That works too.</p>
<p style="font-size:14px;line-height:1.5;margin:18px 0 0">- ${agent}${client.brokerage ? `, ${client.brokerage}` : ""}</p>
</div></div>`;

  const text =
    `${greeting}\n\n${Q1.prompt} Tap one (no typing):\n\n` +
    Q1.options.map((o) => `- ${o}: ${q(o)}`).join("\n") +
    `\n\nOr just reply to this email.\n\n- ${agent}${client.brokerage ? `, ${client.brokerage}` : ""}`;

  return { subject, html, text };
}
