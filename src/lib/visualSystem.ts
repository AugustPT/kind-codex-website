// KindCodex VISUAL SYSTEM — the PROTECTED recognition layer for every generated visual.
// The whole point: recognition comes from a few FROZEN cues (palette, wordmark, the dotted
// "invisible system" device, the rough hand-mark, paper grain). Freshness comes from the
// LAYOUT changing every post. We freeze the cues and free the composition — that is the cure
// for "it looks like a template". Refine these slowly over months; NEVER reset (a reset costs
// ~20% of hard-won recognition — the Tropicana lesson).
//
// CHANGELOG
//   2026-06-21 v1 — signature established: cream/charcoal/terra 2-ink palette, Georgia
//     wordmark with a terra period, dotted connector with exactly one lit terra node,
//     jittered hand-drawn terra mark on the "almost-lost" element, faint paper grain.

export const W = 1080;
export const H = 1350;

// --- Protected palette (2-ink + accent). Do not add colors per-post. ---
export const cream = "#faf9f5";   // ground
export const ink = "#1c1917";     // primary text
export const terra = "#c2410c";   // the ONE accent, used on a single element per frame
export const muted = "#78716c";   // secondary text
export const faint = "#b4b2a9";   // tertiary / the "buries" column marks
export const line = "#e7e5e4";    // hairlines
export const panel = "#f5f0ed";   // muted panel fill

export const SERIF = "Georgia, 'Times New Roman', serif";          // wordmark + big editorial heads
export const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"; // body

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s: string) => String(s || "").replace(/[&<>"']/g, (c) => ESC[c]);

// Greedy word-wrap to a char budget and a max number of lines.
export function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
}

export function tspans(lines: string[], x: number, y: number, lh: number): string {
  return lines.map((l, i) => `<tspan x="${x}" y="${y + i * lh}">${esc(l)}</tspan>`).join("");
}

// Faint paper grain (anti-AI texture). Subtle by design; the layout never depends on it,
// so if a rasterizer drops the filter the card still reads clean.
function grainDef(): string {
  return `<filter id="kcGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;
}

// The SIGNATURE device: a dotted connector (the "wires" of an invisible system) with exactly
// ONE lit terra node. Same DNA every time, never the same picture (vary x/y/width/litAt).
export function dottedSystem(x: number, y: number, w: number, litAt = 0.78, opacity = 0.22): string {
  const litX = Math.round(x + w * litAt);
  return `<g opacity="${opacity}"><path d="M${x} ${y} H${x + w}" stroke="${muted}" stroke-width="3" stroke-dasharray="2 26" fill="none"/></g><circle cx="${litX}" cy="${y}" r="11" fill="${terra}"/>`;
}

// A rough, hand-drawn terra circle — jittered on purpose so it never reads as a clean ellipse.
// This imperfect mark is the cheapest, strongest anti-template + recall move; it always
// circles the thing that almost got lost.
export function roughCircle(cx: number, cy: number, rx: number, ry: number): string {
  const p = (dx: number, dy: number) => `${Math.round(cx + dx)} ${Math.round(cy + dy)}`;
  return `<path d="M ${p(-rx, 4)} C ${p(-rx * 1.02, -ry * 0.9)} ${p(-rx * 0.2, -ry * 1.05)} ${p(rx * 0.5, -ry * 0.92)} C ${p(rx * 1.06, -ry * 0.82)} ${p(rx * 0.98, ry * 0.55)} ${p(rx * 0.45, ry * 1.02)} C ${p(-rx * 0.25, ry * 1.12)} ${p(-rx * 1.05, ry * 0.55)} ${p(-rx * 0.92, -ry * 0.15)}" fill="none" stroke="${terra}" stroke-width="5" stroke-linecap="round"/>`;
}

// A rough hand underline that wobbles slightly off the baseline.
export function roughUnderline(x: number, y: number, w: number): string {
  return `<path d="M${x} ${y} C ${Math.round(x + w * 0.3)} ${y - 7}, ${Math.round(x + w * 0.62)} ${y + 7}, ${x + w} ${y - 2}" fill="none" stroke="${terra}" stroke-width="6" stroke-linecap="round"/>`;
}

// The corner signature — wordmark on every artifact. dark=true for dark slides.
export function cornerSig(dark = false): string {
  const fg = dark ? cream : ink;
  return `<text x="70" y="${H - 60}" font-family="${SERIF}" font-size="34" font-weight="700" fill="${fg}">KindCodex<tspan fill="${terra}">.</tspan></text>`;
}

// Base poster: ground + grain + terra top bar. `inner` is the composition. `dark` flips to the
// charcoal ground used for the mid-deck visual break.
export function poster(inner: string, dark = false): string {
  const bg = dark ? ink : cream;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${grainDef()}</defs>` +
    `<rect width="${W}" height="${H}" fill="${bg}"/>` +
    `<rect width="${W}" height="${H}" filter="url(#kcGrain)" opacity="${dark ? 0.07 : 0.05}"/>` +
    `<rect x="0" y="0" width="${W}" height="18" fill="${terra}"/>` +
    inner +
    `</svg>`;
}

// Footer chrome for a STANDALONE single image (carousel slides use lighter chrome): wordmark
// bottom-left, tagline bottom-right, faint dotted device above. Keeps the TOP free for one big idea.
export function singleFooter(): string {
  return dottedSystem(70, H - 112, W - 140, 0.28, 0.16) +
    cornerSig(false) +
    `<text x="${W - 70}" y="${H - 60}" text-anchor="end" font-family="${SANS}" font-size="28" fill="${muted}">Invisible systems. Visible results.</text>`;
}
