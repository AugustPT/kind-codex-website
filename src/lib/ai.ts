// AI via OpenRouter (OpenAI-compatible). Used to classify cold-reply intent and
// draft a tailored, human-in-the-loop response. Plain fetch, no SDK.

const BASE = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4.5";

export function hasAI(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

const OFFER = `KindCodex (August, Honolulu) builds done-for-you lead systems for Oahu real estate pros. Two products: "never-miss-a-lead" (instant capture + follow-up so no inbound lead goes cold) and "sort-my-leads" (auto-qualify + sort leads). The deal: built free, run free 30 days, then $1,000/mo only if kept, owe nothing otherwise. The next step we want from an interested reply is a quick 15-min call OR they take the free 60-second audit at https://kindcodex.com/{funnel}. If they want to SEE it work first (e.g. they reply "send it"), point them to the LIVE demo where they watch it catch and answer a real lead in seconds: https://kindcodex.com/demo — this is the proof, send the link.`;

export type ReplyIntent =
  | "interested"
  | "question"
  | "objection"
  | "not_interested"
  | "auto_reply"
  | "other";

export interface AiReplyResult {
  intent: ReplyIntent;
  draft: string;
  rationale: string;
}

export interface AiReplyInput {
  name: string;
  company: string;
  funnel: string;
  pain: string;
  research: string;
  replyText: string;
}

// Classify the prospect's reply and draft a response in August's voice.
export async function aiReply(input: AiReplyInput): Promise<AiReplyResult> {
  if (!hasAI()) {
    return {
      intent: "other",
      draft: "(OPENROUTER_API_KEY not set — no AI draft. Reply manually.)",
      rationale: "AI disabled",
    };
  }

  const system = `You are August from KindCodex replying to a COLD-outreach prospect who just responded. Write like a sharp, warm local founder — short, plain, human. No corporate filler, no "I hope this finds you well", no AI em-dash pileups.

${OFFER.replace("{funnel}", input.funnel)}

Your ONLY goal in the reply is to move an interested/curious person toward a quick 15-min call or the free audit — answer what they asked, address concerns honestly, keep it brief (3-6 sentences). If they're clearly not interested, write a gracious one-line close (no pitch). If it's an auto-reply/out-of-office, draft nothing useful.

Return STRICT JSON only, no code fences:
{"intent":"interested|question|objection|not_interested|auto_reply|other","rationale":"one short line","draft":"the email body to send, signed '- August, KindCodex'"}`;

  const user = `PROSPECT
Name: ${input.name}
Company: ${input.company}
Funnel pitched: ${input.funnel}
Their likely pain: ${input.pain}
Research notes: ${input.research}

THEIR REPLY (verbatim):
"""
${input.replyText.slice(0, 4000)}
"""

Classify the intent and draft my response. JSON only.`;

  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://kindcodex.com",
      "X-Title": "KindCodex Reply Assistant",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      temperature: 0.5,
      messages: [
        { role: "system", content: system },
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
  return parseAi(raw);
}

function parseAi(raw: string): AiReplyResult {
  let txt = raw.trim();
  // strip code fences if the model added them
  txt = txt.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  // grab the outermost JSON object
  const start = txt.indexOf("{");
  const end = txt.lastIndexOf("}");
  if (start >= 0 && end > start) txt = txt.slice(start, end + 1);
  try {
    const obj = JSON.parse(txt);
    const intent = (obj.intent || "other") as ReplyIntent;
    return {
      intent,
      draft: String(obj.draft || "").trim(),
      rationale: String(obj.rationale || "").trim(),
    };
  } catch {
    // fall back: treat whole thing as the draft
    return { intent: "other", draft: raw.trim(), rationale: "unparsed AI output" };
  }
}
