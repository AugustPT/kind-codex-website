import { NextResponse } from "next/server";
import { loadCronState, loadLiToken, loadLiSavedAt } from "@/lib/liStore";
import { CONTENT_SCHEDULE } from "@/data/contentSchedule";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// HST is UTC-10 year-round.
function hstToday(): string {
  return new Date(Date.now() - 10 * 3600 * 1000).toISOString().slice(0, 10);
}

// Public, secret-free health snapshot of the LinkedIn content pipeline, so an
// external monitor (cloud routine) can watch it without credentials. Exposes
// only dates and counts — never tokens, captions, or errors with internals.
export async function GET() {
  const state = await loadCronState();
  const creds = await loadLiToken();

  // Token age from LI_SAVED, reported as days-remaining only (LinkedIn member
  // tokens live ~60 days) — the timestamp itself stays server-side.
  const savedAt = await loadLiSavedAt();
  const tokenDaysLeft = savedAt
    ? Math.max(0, Math.round(60 - (Date.now() - savedAt) / 86_400_000))
    : null;

  const today = hstToday();
  const remaining = Math.max(0, CONTENT_SCHEDULE.length - state.nextIdx);
  return NextResponse.json({
    ok: true,
    date: today,
    postedToday: state.lastPost === today,
    lastPost: state.lastPost || null,
    nextIdx: state.nextIdx,
    total: CONTENT_SCHEDULE.length,
    remaining,
    tokenConnected: Boolean(creds),
    tokenDaysLeft,
  });
}
