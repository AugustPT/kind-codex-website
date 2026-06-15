// Brevo API client for the lead-capture + automated nurture engine.
// We use Brevo (not SMTP) because the production env has BREVO_API_KEY set and a
// verified sender, while SMTP_PASS is not configured.

const BASE = "https://api.brevo.com/v3";

const SENDER = {
  email: process.env.BREVO_SENDER_EMAIL || "august@kindcodex.com",
  name: process.env.BREVO_SENDER_NAME || "August — KindCodex",
};

// The "Audit Leads (nurture)" list created via the Brevo API.
export const NURTURE_LIST_ID = Number(process.env.BREVO_NURTURE_LIST_ID || 3);

export function hasBrevo(): boolean {
  return Boolean(process.env.BREVO_API_KEY);
}

function headers() {
  return {
    "api-key": process.env.BREVO_API_KEY as string,
    "Content-Type": "application/json",
    accept: "application/json",
  };
}

export interface LeadAttributes {
  FIRSTNAME?: string;
  BUSINESS?: string;
  SOURCE?: string;
  SIGNUP_TS?: string; // ISO timestamp
  NURTURE_STAGE?: number;
  BOOKED?: boolean;
  AUDIT_RESULT?: string;
}

// Create or update a contact and (optionally) add to the nurture list.
export async function upsertLead(
  email: string,
  attributes: LeadAttributes,
  addToNurture = true
): Promise<void> {
  if (!hasBrevo()) return;
  await fetch(`${BASE}/contacts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      email,
      attributes,
      updateEnabled: true,
      listIds: addToNurture ? [NURTURE_LIST_ID] : undefined,
    }),
  }).catch(() => {});
}

export async function updateLead(email: string, attributes: LeadAttributes): Promise<void> {
  if (!hasBrevo()) return;
  await fetch(`${BASE}/contacts/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ attributes }),
  }).catch(() => {});
}

export interface SendResult {
  ok: boolean;
  status: "sent" | "skipped" | "failed";
  detail?: string;
}

export async function sendEmail(params: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!hasBrevo()) return { ok: true, status: "skipped", detail: "No BREVO_API_KEY" };
  try {
    const res = await fetch(`${BASE}/smtp/email`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: params.to, name: params.toName }],
        replyTo: params.replyTo ? { email: params.replyTo } : undefined,
        subject: params.subject,
        htmlContent: params.html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, status: "failed", detail: `Brevo ${res.status}: ${detail.slice(0, 200)}` };
    }
    return { ok: true, status: "sent" };
  } catch (e) {
    return { ok: false, status: "failed", detail: (e as Error).message };
  }
}

export interface NurtureContact {
  email: string;
  attributes: Record<string, any>;
}

// Pull every contact on the nurture list (paginated).
export async function getNurtureContacts(): Promise<NurtureContact[]> {
  if (!hasBrevo()) return [];
  const out: NurtureContact[] = [];
  let offset = 0;
  const limit = 500;
  // Safety cap so a runaway never loops forever.
  for (let page = 0; page < 50; page++) {
    const res = await fetch(
      `${BASE}/contacts/lists/${NURTURE_LIST_ID}/contacts?limit=${limit}&offset=${offset}`,
      { headers: headers() }
    );
    if (!res.ok) break;
    const data = await res.json();
    const contacts = data.contacts || [];
    for (const c of contacts) out.push({ email: c.email, attributes: c.attributes || {} });
    if (contacts.length < limit) break;
    offset += limit;
  }
  return out;
}
