import { NextResponse } from "next/server";
import { gradeSync } from "@/lib/grader";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Backstop: score every grader lead who has replied since the last run (for realtors who
// replied after closing the page). Auth with CRON_SECRET like the outreach cron.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const r = await gradeSync();
  return NextResponse.json({ ok: true, ...r });
}
