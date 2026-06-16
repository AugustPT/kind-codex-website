import { NextResponse } from "next/server";
import { getAllContacts } from "@/lib/brevo";

export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const contacts = await getAllContacts();

  const rows = contacts
    // only contacts our system added to a pipeline (audit leads have SOURCE;
    // prospects have PIPELINE) — skip stray/unrelated Brevo contacts
    .filter((c) => {
      const a = c.attributes || {};
      return a.PIPELINE || a.SOURCE;
    })
    .map((c) => {
    const a = c.attributes || {};
    const pipeline = (a.PIPELINE || (a.SOURCE ? "inbound" : "")) as string;
    const isInbound = pipeline === "inbound" || (!a.PIPELINE && a.SOURCE);

    let stage: string;
    if (isInbound) {
      stage = a.BOOKED === true ? "booked" : `nurture ${Number(a.NURTURE_STAGE ?? 0)}/5`;
    } else {
      stage = (a.STAGE || "researched") as string;
    }

    return {
      email: c.email,
      name: a.FIRSTNAME || a.COMPANY || c.email,
      company: a.COMPANY || a.BUSINESS || "",
      pipeline: isInbound ? "inbound" : "outbound",
      funnel: a.FUNNEL || a.SOURCE || "",
      ref: a.REF || "",
      stage,
      nurtureStage: a.NURTURE_STAGE ?? null,
      booked: a.BOOKED === true,
      contactEmail: a.CONTACT_EMAIL || "",
      pain: a.PAIN || "",
      research: a.RESEARCH || "",
      result: a.AUDIT_RESULT || "",
      contactUrl: a.CONTACT_URL || "",
      draftedAt: a.DRAFTED_AT || "",
      createdAt: c.createdAt || "",
    };
  });

  // newest first
  rows.sort((x, y) => (y.createdAt || "").localeCompare(x.createdAt || ""));

  const counts = {
    total: rows.length,
    inbound: rows.filter((r) => r.pipeline === "inbound").length,
    outbound: rows.filter((r) => r.pipeline === "outbound").length,
    booked: rows.filter((r) => r.booked).length,
  };

  return NextResponse.json({ rows, counts });
}
