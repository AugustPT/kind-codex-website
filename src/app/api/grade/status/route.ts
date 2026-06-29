import { NextResponse } from "next/server";
import { gradeSync } from "@/lib/grader";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Live poll for the /grade page: checks ONLY this address for a reply, scores it instantly
// if found (and emails the score), so an eager realtor sees their grade the moment they reply.
export async function GET(req: Request) {
  const email = (new URL(req.url).searchParams.get("email") || "").toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  try {
    const r = await gradeSync(email);
    if (r.scored && r.lastScore) {
      return NextResponse.json({ status: "scored", score: r.lastScore });
    }
    return NextResponse.json({ status: r.checked ? "waiting" : "unknown" });
  } catch (e) {
    return NextResponse.json({ status: "waiting", error: (e as Error).message });
  }
}
