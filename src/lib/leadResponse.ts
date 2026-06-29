// Instant Lead Response — the actual product KindCodex sells ("never-miss-a-lead").
// The moment a buyer inquiry lands, generate (in seconds) a warm, personalized reply
// to the BUYER plus a sharp alert for the AGENT. Same OpenRouter plumbing as ai.ts.
// Powers both the public /demo and (wired to a client's real lead sources) the
// delivered product.

const BASE = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4.5";

export function hasAI(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export interface LeadInput {
  name: string; // buyer's name
  message: string; // their inquiry text
  property?: string; // property address or area of interest
  agentName?: string; // the realtor this is responding on behalf of
  brokerage?: string;
}

export interface LeadResponseResult {
  buyerSubject: string; // subject of the reply sent to the buyer
  buyerReply: string; // the instant reply the buyer receives
  agentAlert: string; // a tight summary + suggested action for the agent
  temperature: "hot" | "warm" | "cold"; // quick qualification read
  why: string; // one line: why that temperature
}

const SYSTEM = (agentName: string, brokerage: string) =>
  `You are the instant-response assistant for ${agentName}${brokerage ? ` at ${brokerage}` : ""}, a real estate agent. A brand-new buyer inquiry just arrived and your job is to answer it within SECONDS so the lead never goes cold.

Write two things:
1) BUYER REPLY — a warm, human, on-brand reply sent on the agent's behalf. Acknowledge their SPECIFIC interest (the property/area they named), sound like a real local pro (not a bot), answer the obvious question, ask 1-2 quick qualifying questions (timeline, are they pre-approved / working with a lender, must-haves), and propose a concrete next step (a quick call or a showing). 4-7 sentences. Sign it as "${agentName}${brokerage ? ` · ${brokerage}` : ""}". No corporate filler, no "I hope this finds you well", no em-dash pileups, no fake urgency. CRITICAL: you do NOT have the private listing data (exact price, square footage, MLS #). NEVER write bracketed placeholders like [PRICE] or "[check MLS]". If you don't know a detail, offer to send the full info packet or ask — the reply must read as 100% finished and sendable with zero placeholders.
2) AGENT ALERT — one tight paragraph for the agent's phone: who came in, what they want, how hot they look, and the single suggested next action.

Also classify the lead's temperature (hot/warm/cold) with a one-line reason.

Return STRICT JSON only, no code fences:
{"buyerSubject":"...","buyerReply":"...","agentAlert":"...","temperature":"hot|warm|cold","why":"one short line"}`;

export async function generateLeadResponse(input: LeadInput): Promise<LeadResponseResult> {
  const agentName = (input.agentName || "the team").trim();
  const brokerage = (input.brokerage || "").trim();

  if (!hasAI()) {
    return {
      buyerSubject: `Re: your inquiry${input.property ? ` about ${input.property}` : ""}`,
      buyerReply:
        `Hi ${input.name || "there"}, thanks for reaching out${input.property ? ` about ${input.property}` : ""}. ` +
        `(Demo note: set OPENROUTER_API_KEY to generate a real AI reply.)`,
      agentAlert: `New lead: ${input.name || "unknown"}. (AI disabled — set OPENROUTER_API_KEY.)`,
      temperature: "warm",
      why: "AI disabled",
    };
  }

  const user = `NEW BUYER INQUIRY
Buyer name: ${input.name || "(not given)"}
Property / area of interest: ${input.property || "(not specified)"}
Their message (verbatim):
"""
${String(input.message || "").slice(0, 3000)}
"""

Write the buyer reply and the agent alert. JSON only.`;

  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://kindcodex.com",
      "X-Title": "KindCodex Instant Lead Response",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      temperature: 0.5,
      messages: [
        { role: "system", content: SYSTEM(agentName, brokerage) },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw: string = (data?.choices?.[0]?.message?.content || "").trim();
  return parse(raw, input);
}

function parse(raw: string, input: LeadInput): LeadResponseResult {
  let txt = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = txt.indexOf("{");
  const end = txt.lastIndexOf("}");
  if (start >= 0 && end > start) txt = txt.slice(start, end + 1);
  try {
    const o = JSON.parse(txt);
    const temp = (["hot", "warm", "cold"] as const).includes(o.temperature) ? o.temperature : "warm";
    return {
      buyerSubject: String(o.buyerSubject || `Re: your inquiry`).trim(),
      buyerReply: String(o.buyerReply || "").trim(),
      agentAlert: String(o.agentAlert || "").trim(),
      temperature: temp,
      why: String(o.why || "").trim(),
    };
  } catch {
    return {
      buyerSubject: `Re: your inquiry${input.property ? ` about ${input.property}` : ""}`,
      buyerReply: raw.trim(),
      agentAlert: `New lead from ${input.name || "unknown"} — review needed.`,
      temperature: "warm",
      why: "unparsed AI output",
    };
  }
}
