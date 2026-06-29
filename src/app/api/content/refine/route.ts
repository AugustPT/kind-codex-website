import { NextResponse } from "next/server";
import { refinePost, assemblePost } from "@/lib/content";
import { cardSvg, overlaySvg, chipSvg } from "@/lib/contentCard";
import { generateImage, imagePromptFor } from "@/lib/aiImage";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

const firstLine = (s: string) => String(s || "").split("\n")[0].trim();
const IMAGE_STYLES = new Set(["photo-overlay", "photo-clean", "illustration"]);

// Apply a free-text edit to ONE post (copy and/or visual), reusing the existing
// image unless a new one is explicitly requested.
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { post, instruction } = await req.json();
  if (!post || !instruction || !String(instruction).trim()) {
    return NextResponse.json({ error: "post and instruction required" }, { status: 400 });
  }

  let r;
  try {
    r = await refinePost(post, String(instruction));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
  if (!r) return NextResponse.json({ error: "AI not available" }, { status: 500 });

  const out: any = { ...r, fullText: assemblePost(r), bgImage: undefined, overlaySvg: undefined, imageSvg: undefined };

  if (IMAGE_STYLES.has(r.visualStyle)) {
    let bgImage = post.bgImage as string | undefined; // reuse the existing image by default
    if (r.regenImage || !bgImage) {
      const kind = r.visualStyle === "illustration" ? "illustration" : "photo";
      bgImage = (await generateImage(imagePromptFor(kind, r.imageBrief || r.topic || "small business lead generation"))) || bgImage;
    }
    if (bgImage) {
      out.bgImage = bgImage;
      out.overlaySvg = r.visualStyle === "photo-clean" ? chipSvg() : overlaySvg(r.cardHeadline || firstLine(r.body));
    } else {
      out.imageSvg = cardSvg({ ...r, format: r.format === "text" ? "stat" : r.format });
      out.visualStyle = "card";
    }
  } else if (r.visualStyle !== "text") {
    out.imageSvg = cardSvg({ ...r, format: r.format === "text" ? "stat" : r.format });
  }

  return NextResponse.json({ post: out });
}
