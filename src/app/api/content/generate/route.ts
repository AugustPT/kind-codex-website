import { NextResponse } from "next/server";
import { generatePosts, assemblePost, hasAI } from "@/lib/content";
import { cardSvg, overlaySvg, chipSvg, carouselSlides } from "@/lib/contentCard";
import { generateImage, imagePromptFor } from "@/lib/aiImage";
import { chatgptPrompts } from "@/lib/chatgptPrompt";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

const firstLine = (s: string) => String(s || "").split("\n")[0].trim();
const IMAGE_STYLES = new Set(["photo-overlay", "photo-clean", "illustration"]);

// Generate a fresh MIXED batch: real photos, illustrations, branded cards, and text.
export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasAI()) return NextResponse.json({ error: "OPENROUTER_API_KEY not set" }, { status: 500 });

  const url = new URL(req.url);
  const n = Math.min(Math.max(Number(url.searchParams.get("n") || 5), 1), 8);
  const topic = url.searchParams.get("topic") || "";

  let posts;
  try {
    posts = await generatePosts(n, topic);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }

  // Cap real-image generation per batch (cost + latency + response size); extras fall back to cards.
  // ?fast=1 skips AI image generation entirely (text + SVG cards/carousels only) — fast, no 504 on big batches.
  let imageBudget = url.searchParams.get("fast") ? 0 : 3;
  const out = await Promise.all(
    posts.map(async (p) => {
      // Every post carries its ready-to-paste ChatGPT image prompt(s) — ChatGPT is the image
      // generator (approach A). Single image -> chatgptImagePrompt; carousel -> chatgptSlidePrompts.
      const cg = chatgptPrompts(p);
      const base = { ...p, fullText: assemblePost(p), chatgptImagePrompt: cg.imagePrompt, chatgptSlidePrompts: cg.slidePrompts };
      // Carousel: a swipeable SVG document (no AI image). It can't be auto-posted via the
      // LinkedIn API (organic document carousels aren't supported), so the admin downloads a
      // PDF and uploads it manually. Render all slides here.
      if (p.format === "carousel") {
        return { ...base, visualStyle: "carousel", slidesSvg: carouselSlides(p) };
      }
      const wantsImage = IMAGE_STYLES.has(p.visualStyle);
      if (wantsImage && imageBudget > 0) {
        imageBudget--;
        const kind = p.visualStyle === "illustration" ? "illustration" : "photo";
        const bgImage = await generateImage(imagePromptFor(kind, p.imageBrief || p.topic || "small business lead generation"));
        if (bgImage) {
          const overlay = p.visualStyle === "photo-clean" ? chipSvg() : overlaySvg(p.cardHeadline || firstLine(p.body));
          return { ...base, bgImage, overlaySvg: overlay };
        }
        // image gen failed -> fall back to a branded card
        return { ...base, visualStyle: "card", imageSvg: cardSvg({ ...p, format: p.format === "text" ? "stat" : p.format }) };
      }
      if (p.visualStyle === "text") return base;
      // card (default), or an image-style post that exceeded the budget
      return { ...base, visualStyle: p.visualStyle === "text" ? "text" : "card", imageSvg: cardSvg({ ...p, format: p.format === "text" ? "stat" : p.format }) };
    })
  );

  return NextResponse.json({ posts: out, count: out.length });
}
