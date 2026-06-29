// The ChatGPT image-prompt factory. The content engine writes the copy; this turns each post
// into a STRICT, brand-locked prompt to paste into ChatGPT (the image generator). The brand
// block is frozen and pasted byte-identical into every prompt so a whole batch/carousel comes
// out uniform. Mirrors the SVG visual system in ./visualSystem so both paths look like one brand.
import type { ContentPost, Slide } from "./content";

// Frozen KindCodex brand block — do not paraphrase; every prompt starts with this verbatim.
export const BRAND_LOCK = `Create ONE portrait image, 1024x1536 (4:5), high quality, designed to a professional standard.
BRAND LOCK (follow exactly):
- Background: solid cream #faf9f5. No gradients, no textures, no photos, no stock imagery, no clip art, no drop shadows, no 3D.
- Primary text and line art: charcoal #1c1917.
- Single accent color: terra-cotta #c2410c, used in EXACTLY TWO places (the period after the wordmark, and ONE short highlight such as an underline, a check mark, or a single keyword). Introduce no other colors.
- Aesthetic: minimal, editorial, calm, generous negative space, flat clean shapes, classic Georgia-style serif typography.
- 8% uniform padding on all edges.
- Top-left: the wordmark rendered verbatim as "KindCodex" in a Georgia-style serif (capital K, capital C, lowercase rest, spell it K-i-n-d-C-o-d-e-x) immediately followed by a terra-cotta #c2410c period.
- Bottom-left, small charcoal serif footer: "Invisible systems. Visible results."
TEXT RULES: render every quoted string VERBATIM, exactly as written, no extra characters, no invented labels, no decorative microcopy, and no other text anywhere on the image.`;

// Wrap a string as a verbatim-quoted token (straight quotes; collapse inner quotes).
const q = (s: string) => `"${String(s || "").replace(/[“”]/g, "'").replace(/"/g, "'").trim()}"`;

function comparisonPrompt(p: ContentPost): string {
  const left = (p.cardLeft || []).map(q).join(", ");
  const right = (p.cardRight || []).map(q).join(", ");
  return `${BRAND_LOCK}
LAYOUT: A two-column comparison board. A large centered serif headline in the upper area: ${q(p.cardHeadline || "Where leads die")}, with a short terra-cotta underline beneath it. Below, two equal columns separated by a thin charcoal vertical rule.
LEFT column heading (small, charcoal, uppercase): ${q(p.cardLeftTitle || "What buries the lead")}; each item preceded by a small charcoal cross mark; items top to bottom: ${left}.
RIGHT column heading (small, terra-cotta, uppercase): ${q(p.cardRightTitle || "The invisible system")}; each item preceded by a small terra-cotta check mark; items top to bottom: ${right}.
Align the rows so each left item sits directly opposite its matching right item.`;
}

function statPrompt(p: ContentPost): string {
  return `${BRAND_LOCK}
LAYOUT: ONE oversized number or short stat as the hero, set very large in charcoal serif, left-aligned in the middle of the canvas: ${q(p.cardHeadline || "9 hours")}. A short terra-cotta underline directly beneath it. Below the underline, a single charcoal serif context line: ${q(p.cardSub || "")}. Generous empty cream space above and below the number.`;
}

function quotePrompt(p: ContentPost): string {
  const quote = p.cardQuote || String(p.body || "").split("\n")[0];
  return `${BRAND_LOCK}
LAYOUT: A large pulled quote, charcoal serif, set in the upper-middle with generous line spacing: ${q(quote)}. A small terra-cotta serif attribution line below it: ${q(p.cardAttribution || "August, KindCodex")}. A single oversized terra-cotta quotation mark may sit faintly behind the text as the one accent.`;
}

function illustratedPrompt(p: ContentPost): string {
  const headline = p.cardHeadline || p.coverHook || String(p.body || "").split("\n")[0];
  return `${BRAND_LOCK}
LAYOUT: A minimal FLAT EDITORIAL ILLUSTRATION (clean charcoal line art with the single terra-cotta accent, no photographic realism) depicting: ${p.imageBrief || "a single glowing droplet about to fall past an open hand"}. Lots of cream negative space around it. Place one short serif headline in charcoal in a clear area: ${q(headline)}.`;
}

function mockupPrompt(p: ContentPost): string {
  const headline = p.cardHeadline || String(p.body || "").split("\n")[0];
  return `${BRAND_LOCK}
LAYOUT: A clean, minimal UI MOCKUP rendered in the brand palette (cream surface, charcoal text and lines, one terra-cotta accent), flat with no heavy shadows, depicting: ${p.imageBrief || "a simple lead inbox where a new message is auto-answered in 40 seconds"}. Keep all interface labels legible, short, and minimal. Add one short serif caption in charcoal above or below the mockup: ${q(headline)}.`;
}

// Single-image prompt for a non-carousel visual post. "" for text (no image).
export function imagePrompt(p: ContentPost): string {
  switch (p.format) {
    case "comparison": return comparisonPrompt(p);
    case "stat": return statPrompt(p);
    case "quote": return quotePrompt(p);
    case "illustrated": return illustratedPrompt(p);
    case "mockup": return mockupPrompt(p);
    default: return "";
  }
}

// Ordered per-slide prompts for a carousel: cover (the template) + numbered body slides + CTA.
export function carouselPrompts(p: ContentPost): string[] {
  const slides: Slide[] = p.slides && p.slides.length ? p.slides : [];
  const total = slides.length + 2;
  const cover = `${BRAND_LOCK}
This is SLIDE 1 of ${total} in a uniform carousel — it sets the visual template every other slide must match.
LAYOUT: A large centered serif headline, charcoal: ${q(p.coverHook || p.cardHeadline || "The lead that almost got lost")}. A short terra-cotta underline under the final phrase. Bottom-right, small charcoal serif slide number "1/${total}".`;
  const body = slides.map((s, i) => `${BRAND_LOCK}
This is SLIDE ${i + 2} of ${total} in the SAME carousel. Match slide 1 EXACTLY — identical background, palette, wordmark, footer, margins, and type treatment. Change only the content.
LAYOUT: An oversized terra-cotta serif numeral "${i + 1}" near the top as the one accent. Below it a charcoal serif headline: ${q(s.title)}. Under the headline, a smaller charcoal serif line: ${q(s.body)}. Bottom-right, small charcoal serif slide number "${i + 2}/${total}".`);
  const cta = `${BRAND_LOCK}
This is the FINAL SLIDE (${total}/${total}) of the SAME carousel. Match slide 1 EXACTLY.
LAYOUT: Two large centered serif lines: ${q("Invisible systems.")} in charcoal, then ${q("Visible results.")} in terra-cotta. Below them a charcoal serif call to action: ${q(p.ctaLine || 'Comment "AUDIT" and it comes to you.')}. Bottom-right, small charcoal serif slide number "${total}/${total}".`;
  return [cover, ...body, cta];
}

// What the API attaches to each post: a single image prompt, or the carousel's slide prompts.
export function chatgptPrompts(p: ContentPost): { imagePrompt: string; slidePrompts: string[] } {
  if (p.format === "carousel") return { imagePrompt: "", slidePrompts: carouselPrompts(p) };
  return { imagePrompt: imagePrompt(p), slidePrompts: [] };
}
