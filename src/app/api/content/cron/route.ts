import { NextResponse } from "next/server";
import { postImage, postText } from "@/lib/linkedin";
import { loadLiToken, loadCronState, saveCronState } from "@/lib/liStore";
import { CONTENT_SCHEDULE } from "@/data/contentSchedule";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// HST is UTC-10 year-round (no DST) → YYYY-MM-DD for "today" in Hawaii.
function hstToday(): string {
  return new Date(Date.now() - 10 * 3600 * 1000).toISOString().slice(0, 10);
}

// Two ways in: the GitHub Actions / Vercel cron uses the Bearer secret; the admin
// browser can trigger a manual run with the x-admin-key header.
function authed(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const admin = process.env.ADMIN_PASSWORD;
  if (secret && req.headers.get("authorization") === `Bearer ${secret}`) return true;
  if (admin && req.headers.get("x-admin-key") === admin) return true;
  return false;
}

async function fetchImageDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = url.endsWith(".gif")
    ? "image/gif"
    : url.endsWith(".png")
      ? "image/png"
      : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

// Posts the next queued animated post to LinkedIn — at most one per HST day.
// Idempotent: a second call the same day is a no-op unless ?force=1 is passed
// (used for the manual verification run). Advances a server-stored index so each
// day picks up the next item automatically.
export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const force = new URL(req.url).searchParams.get("force") === "1";
  const today = hstToday();

  const state = await loadCronState();
  if (!force && state.lastPost === today) {
    return NextResponse.json({ ok: true, skipped: "already posted today", date: today });
  }
  if (state.nextIdx >= CONTENT_SCHEDULE.length) {
    return NextResponse.json({ ok: true, skipped: "schedule exhausted", nextIdx: state.nextIdx });
  }

  const creds = await loadLiToken();
  if (!creds) {
    return NextResponse.json(
      { error: "LinkedIn token not synced — open /admin and click Sync token." },
      { status: 412 }
    );
  }

  const item = CONTENT_SCHEDULE[state.nextIdx];
  const base = process.env.SITE_URL || "https://kindcodex.com";

  // A schedule entry without a gif is a text-only post (personal-brand text pieces).
  let result: { ok: boolean; id?: string; error?: string };
  if (item.gif) {
    let dataUrl: string;
    try {
      dataUrl = await fetchImageDataUrl(item.gif.startsWith("http") ? item.gif : base + item.gif);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 502 });
    }
    result = await postImage(item.caption, dataUrl, creds.token, creds.urn);
  } else {
    result = await postText(item.caption, creds.token, creds.urn);
  }
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });

  await saveCronState(today, state.nextIdx + 1);
  return NextResponse.json({
    ok: true,
    posted: item.gif || `text:${item.caption.slice(0, 60)}`,
    id: result.id,
    nextIdx: state.nextIdx + 1,
    remaining: CONTENT_SCHEDULE.length - (state.nextIdx + 1),
    date: today,
  });
}
