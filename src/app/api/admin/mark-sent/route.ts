import { NextResponse } from "next/server";
import { getAllContacts, updateLead } from "@/lib/brevo";

export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

// Called by the Gmail Apps Script when it detects you sent/got a reply from a
// prospect. Matches by the prospect's real CONTACT_EMAIL and advances STAGE.
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { email, stage } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  const target = String(email).trim().toLowerCase();
  const newStage = (String(stage || "sent")).toLowerCase();

  const contacts = await getAllContacts();
  const match = contacts.find(
    (c) => String(c.attributes?.CONTACT_EMAIL || "").trim().toLowerCase() === target
  );

  if (!match) {
    return NextResponse.json({ ok: false, matched: false });
  }

  // Don't downgrade: once "replied" or "won", a later "sent" ping shouldn't revert.
  const ORDER = ["researched", "drafted", "sent", "replied", "won"];
  const current = String(match.attributes?.STAGE || "drafted").toLowerCase();
  if (ORDER.indexOf(newStage) <= ORDER.indexOf(current)) {
    return NextResponse.json({ ok: true, matched: true, changed: false, stage: current });
  }

  await updateLead(match.email, { STAGE: newStage } as any);
  return NextResponse.json({ ok: true, matched: true, changed: true, stage: newStage });
}
