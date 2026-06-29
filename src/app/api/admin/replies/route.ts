import { NextResponse } from "next/server";
import { getAllContacts, updateLead } from "@/lib/brevo";
import { scanReplies } from "@/lib/replies";
import { aiReply } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

const norm = (e: string) => String(e || "").toLowerCase().trim();

// Live: read the inbox for prospect replies, and for each unhandled reply have the
// AI classify intent + draft a tailored response for August to review and send.
export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const contacts = await getAllContacts();
  // outbound prospects only, keyed by their email
  const byEmail = new Map<string, any>();
  for (const c of contacts) {
    const a = c.attributes || {};
    if ((a.PIPELINE || "").toLowerCase() !== "outbound") continue;
    const email = norm(a.CONTACT_EMAIL || c.email);
    if (email) byEmail.set(email, { email, attrs: a });
  }
  const prospectEmails = new Set(byEmail.keys());

  const replies = await scanReplies(prospectEmails, 30);

  // Only surface replies we haven't handled yet.
  const pending = [...replies.values()].filter((r) => {
    const p = byEmail.get(norm(r.fromEmail));
    return p && p.attrs.REPLY_HANDLED !== true && String(p.attrs.REPLY_HANDLED) !== "true";
  });

  const drafted = await Promise.all(
    pending.map(async (r) => {
      const p = byEmail.get(norm(r.fromEmail));
      const a = p.attrs;
      let ai = { intent: "other", draft: "", rationale: "" } as any;
      try {
        ai = await aiReply({
          name: a.FIRSTNAME || a.COMPANY || "",
          company: a.COMPANY || "",
          funnel: a.FUNNEL || "never-miss-a-lead",
          pain: a.PAIN || "",
          research: a.RESEARCH || "",
          replyText: r.text,
        });
      } catch (e) {
        ai = { intent: "other", draft: "", rationale: "AI error: " + (e as Error).message };
      }
      // Opt-out / not-interested → suppress permanently (STAGE=dead) and clear the draft,
      // so no reply is sent and they never get another email. Belt-and-suspenders with the
      // deterministic opt-out catch in gmailSync.
      if (ai.intent === "not_interested") {
        try { await updateLead(r.fromEmail, { STAGE: "dead", REPLY_HANDLED: true }); } catch { /* non-fatal */ }
        ai.draft = "";
        ai.rationale = "Auto-removed from all future sends (not interested). " + (ai.rationale || "");
      }
      return {
        email: r.fromEmail,
        name: a.FIRSTNAME || a.COMPANY || r.fromEmail,
        company: a.COMPANY || "",
        funnel: a.FUNNEL || "",
        replySubject: r.subject,
        replyText: r.text,
        replyAt: r.at,
        intent: ai.intent,
        rationale: ai.rationale,
        aiDraft: ai.draft,
        suggestedSubject: r.subject?.toLowerCase().startsWith("re:") ? r.subject : `Re: ${r.subject}`,
      };
    })
  );

  drafted.sort((x, y) => (y.replyAt || "").localeCompare(x.replyAt || ""));
  return NextResponse.json({ replies: drafted, count: drafted.length });
}
