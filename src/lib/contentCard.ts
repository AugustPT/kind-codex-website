// Branded LinkedIn visuals — poster-logic single images AND swipeable document carousels.
// Portrait 1080x1350 (4:5), the best-performing size for mobile feeds. Self-contained SVG
// (rasterized to PNG client-side in the admin; carousels assembled into a PDF for upload).
// All recognition cues come from ./visualSystem (the PROTECTED layer); each composition is
// built fresh so the set reads art-directed, not templated.
import type { ContentPost, Slide } from "./content";
import {
  W, H, SERIF, SANS, cream, ink, terra, muted, faint, line,
  esc, wrap, tspans, poster, singleFooter, dottedSystem, roughUnderline, cornerSig,
} from "./visualSystem";

// ---------------------------------------------------------------------------
// Single-image cards. Brand chrome lives in the FOOTER so the top is free for
// one dominant idea (poster logic, not slide logic).
// ---------------------------------------------------------------------------
function singleFrame(inner: string): string {
  return poster(inner + singleFooter());
}

// ONE giant number/stat as the hero (Visual-Capitalist-credible using problem mechanics or a
// public category stat — never a fabricated client result).
function statCard(p: ContentPost): string {
  const head = (p.cardHeadline || "").trim();
  const sub = wrap(p.cardSub, 32, 3);
  const compact = head.replace(/\s/g, "").length <= 7; // "43%", "9 hours", "9:14pm"
  if (compact) {
    // Auto-size the giant number so it always fits the 1080 canvas (≈900px of usable width).
    const vlen = Math.max(2, head.length);
    const size = Math.max(120, Math.min(300, Math.floor(900 / (vlen * 0.58))));
    const baseY = 660;
    const underW = Math.min(900, Math.round(vlen * size * 0.56));
    return singleFrame(
      `<text x="80" y="${baseY}" font-family="${SERIF}" font-size="${size}" font-weight="700" fill="${ink}" letter-spacing="-4">${esc(head)}</text>` +
      roughUnderline(86, baseY + 58, underW) +
      (sub.length ? `<text font-family="${SANS}" font-size="46" font-weight="600" fill="${ink}">${tspans(sub, 84, baseY + 150, 60)}</text>` : "")
    );
  }
  const hl = wrap(head, 13, 4);
  const top = 430;
  return singleFrame(
    `<text font-family="${SERIF}" font-size="118" font-weight="700" fill="${ink}" letter-spacing="-2">${tspans(hl, 80, top, 138)}</text>` +
    (sub.length ? `<text font-family="${SANS}" font-size="42" font-weight="600" fill="${terra}">${tspans(sub, 80, top + hl.length * 138 + 46, 56)}</text>` : "")
  );
}

// The buries-vs-saves comparison board — the highest-save single image. Paired rows so the eye
// is forced to compare; the loud red/green convention re-skinned to calm cream/terra/charcoal.
function comparisonCard(p: ContentPost): string {
  const title = wrap(p.cardHeadline || "Where leads die", 16, 2);
  const leftT = (p.cardLeftTitle || "What buries the lead").toUpperCase();
  const rightT = (p.cardRightTitle || "The invisible system").toUpperCase();
  const left = p.cardLeft.slice(0, 4);
  const right = p.cardRight.slice(0, 4);
  const rows = Math.max(left.length, right.length, 1);
  const top = 520, rowH = 150;
  const lastTitle = title[title.length - 1] || "";
  let out =
    `<text font-family="${SERIF}" font-size="86" font-weight="700" fill="${ink}" letter-spacing="-1">${tspans(title, 80, 200, 96)}</text>` +
    roughUnderline(80, 200 + (title.length - 1) * 96 + 28, Math.min(560, lastTitle.length * 46)) +
    (p.cardSub ? `<text x="80" y="270" font-family="${SANS}" font-size="32" fill="${muted}">${esc(p.cardSub)}</text>` : "") +
    `<text x="80" y="420" font-family="${SANS}" font-size="27" font-weight="700" letter-spacing="1" fill="${muted}">${esc(leftT)}</text>` +
    `<text x="580" y="420" font-family="${SANS}" font-size="27" font-weight="700" letter-spacing="1" fill="${terra}">${esc(rightT)}</text>` +
    `<line x1="540" y1="370" x2="540" y2="${top + rows * rowH - 70}" stroke="${line}" stroke-width="2"/>`;
  for (let i = 0; i < rows; i++) {
    const y = top + i * rowH;
    if (left[i]) {
      const l = wrap(left[i], 20, 2);
      out += `<text x="70" y="${y}" font-family="${SANS}" font-size="40" fill="${faint}">&#10005;</text>` +
        `<text font-family="${SANS}" font-size="34" fill="${ink}">${l.map((ln, j) => `<tspan x="120" y="${y + j * 42}">${esc(ln)}</tspan>`).join("")}</text>`;
    }
    if (right[i]) {
      const r = wrap(right[i], 20, 2);
      out += `<text x="580" y="${y}" font-family="${SANS}" font-size="40" fill="${terra}">&#10003;</text>` +
        `<text font-family="${SANS}" font-size="34" fill="${ink}">${r.map((ln, j) => `<tspan x="630" y="${y + j * 42}">${esc(ln)}</tspan>`).join("")}</text>`;
    }
  }
  return singleFrame(out);
}

function checklistCard(p: ContentPost): string {
  const hl = wrap(p.cardHeadline, 20, 3);
  let y = 300;
  let out = `<text font-family="${SERIF}" font-size="76" font-weight="700" fill="${ink}" letter-spacing="-1">${tspans(hl, 80, y, 88)}</text>`;
  y += hl.length * 88 + 80;
  for (const item of p.cardItems) {
    const il = wrap(item, 28, 2);
    out += `<circle cx="98" cy="${y - 16}" r="16" fill="none" stroke="${terra}" stroke-width="4"/><path d="M88 -16 l8 9 l16 -19" transform="translate(2 ${y})" fill="none" stroke="${terra}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    out += `<text font-family="${SANS}" font-size="42" font-weight="600" fill="${ink}">${il.map((l, j) => `<tspan x="150" y="${y + j * 50}">${esc(l)}</tspan>`).join("")}</text>`;
    y += il.length * 50 + 48;
  }
  return singleFrame(out);
}

function quoteCard(p: ContentPost): string {
  const q = wrap(p.cardQuote, 18, 6);
  const startY = 480;
  return singleFrame(
    `<text x="80" y="360" font-family="${SERIF}" font-size="190" fill="${terra}" opacity="0.22">&#8220;</text>` +
    `<text font-family="${SERIF}" font-size="76" font-weight="700" fill="${ink}" letter-spacing="-0.5">${tspans(q, 80, startY, 98)}</text>` +
    `<text x="80" y="${startY + q.length * 98 + 64}" font-family="${SANS}" font-size="32" font-weight="600" fill="${terra}">${esc(p.cardAttribution || "August, KindCodex")}</text>`
  );
}

// Returns the SVG for a post's single image card, or "" for text / carousel posts.
export function cardSvg(p: ContentPost): string {
  switch (p.format) {
    case "stat": return statCard(p);
    case "checklist": return checklistCard(p);
    case "quote": return quoteCard(p);
    case "comparison": return comparisonCard(p);
    default: return ""; // text or carousel (carousel uses carouselSlides)
  }
}

// ---------------------------------------------------------------------------
// Document carousel — the highest-dwell LinkedIn format. Each slide is one idea;
// shared chrome (slide counter, terra progress bar, corner wordmark, swipe cue)
// builds recognition; slide 4 flips dark as a mid-deck pattern interrupt.
// ---------------------------------------------------------------------------
function slideChrome(idx: number, total: number, dark: boolean): string {
  const barW = W - 140;
  const pct = total > 1 ? (idx + 1) / total : 1;
  const sub = dark ? "#a8a29e" : muted;
  return `<text x="${W - 70}" y="118" text-anchor="end" font-family="${SANS}" font-size="30" fill="${sub}">${idx + 1} / ${total}</text>` +
    `<rect x="70" y="${H - 110}" width="${barW}" height="6" rx="3" fill="${dark ? "#44403c" : line}"/>` +
    `<rect x="70" y="${H - 110}" width="${Math.round(barW * pct)}" height="6" rx="3" fill="${terra}"/>` +
    cornerSig(dark) +
    (idx < total - 1 ? `<text x="${W - 70}" y="${H - 60}" text-anchor="end" font-family="${SANS}" font-size="30" fill="${sub}">swipe &#8250;</text>` : "");
}

function coverSlide(hook: string, total: number): string {
  const lines = wrap(hook, 17, 5);
  const lh = 96, startY = 440;
  const last = lines[lines.length - 1] || "";
  return poster(
    dottedSystem(70, 260, W - 140, 0.8, 0.2) +
    `<text font-family="${SERIF}" font-size="82" font-weight="700" fill="${ink}" letter-spacing="-1">${tspans(lines, 80, startY, lh)}</text>` +
    roughUnderline(80, startY + (lines.length - 1) * lh + 28, Math.min(720, last.length * 42)) +
    slideChrome(0, total, false)
  );
}

function bodySlide(n: number, s: Slide, idx: number, total: number, dark: boolean): string {
  const titleColor = dark ? cream : ink;
  const bodyColor = dark ? "#d6d3d1" : muted;
  const title = wrap(s.title || "", 17, 2);
  const body = wrap(s.body || "", 30, 4);
  const titleY = 600;
  return poster(
    `<text x="80" y="380" font-family="${SERIF}" font-size="190" font-weight="700" fill="${terra}" opacity="0.92">${n}</text>` +
    `<text font-family="${SANS}" font-size="68" font-weight="800" fill="${titleColor}" letter-spacing="-1">${tspans(title, 80, titleY, 82)}</text>` +
    (body.length ? `<text font-family="${SANS}" font-size="40" fill="${bodyColor}">${tspans(body, 80, titleY + title.length * 82 + 56, 56)}</text>` : "") +
    slideChrome(idx, total, dark),
    dark
  );
}

function ctaSlide(p: ContentPost, idx: number, total: number): string {
  const cta = wrap(p.ctaLine || 'Comment "AUDIT" and it comes to you.', 24, 3);
  return poster(
    `<text x="80" y="440" font-family="${SERIF}" font-size="84" font-weight="700" fill="${ink}">Invisible systems.</text>` +
    `<text x="80" y="540" font-family="${SERIF}" font-size="84" font-weight="700" fill="${terra}">Visible results.</text>` +
    `<text font-family="${SANS}" font-size="46" font-weight="600" fill="${ink}">${tspans(cta, 80, 720, 62)}</text>` +
    dottedSystem(70, 900, W - 140, 0.5, 0.3) +
    slideChrome(idx, total, false)
  );
}

// Build the ordered slide SVGs for a carousel post: cover + body slides + CTA.
export function carouselSlides(p: ContentPost): string[] {
  const body = p.slides && p.slides.length ? p.slides : [];
  const hook = p.coverHook || p.cardHeadline || String(p.body || "").split("\n")[0] || "The lead that almost got lost.";
  const total = body.length + 2;
  const out: string[] = [coverSlide(hook, total)];
  body.forEach((s, i) => out.push(bodySlide(i + 1, s, i + 1, total, i + 1 === 3)));
  out.push(ctaSlide(p, total - 1, total));
  return out;
}

// ---------------------------------------------------------------------------
// Photo overlays (for AI/real photo posts) — kept from the prior engine.
// ---------------------------------------------------------------------------
export function overlaySvg(headline: string): string {
  const hl = wrap(headline, 24, 4);
  const lh = 72;
  const blockH = hl.length * lh;
  const scrimTop = H - (blockH + 250);
  const firstY = scrimTop + 150;
  const tsp = hl.map((l, i) => `<tspan x="70" y="${Math.round(firstY + i * lh)}">${esc(l)}</tspan>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="${Math.round(scrimTop)}" width="${W}" height="${Math.round(blockH + 250)}" fill="#0c0a09" opacity="0.62"/>
  <rect x="0" y="0" width="${W}" height="12" fill="${terra}"/>
  <text x="70" y="${Math.round(scrimTop + 70)}" font-family="${SERIF}" font-size="32" font-weight="700" fill="${cream}">KindCodex<tspan fill="${terra}">.</tspan></text>
  <text font-family="${SANS}" font-size="60" font-weight="800" fill="${cream}" letter-spacing="-0.5">${tsp}</text>
  <text x="70" y="${H - 50}" font-family="${SANS}" font-size="24" fill="#d6d3d1">kindcodex.com</text>
</svg>`;
}

export function chipSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="0" width="${W}" height="12" fill="${terra}"/>
  <rect x="40" y="${H - 96}" width="318" height="56" rx="10" fill="#0c0a09" opacity="0.6"/>
  <text x="62" y="${H - 58}" font-family="${SERIF}" font-size="28" font-weight="700" fill="${cream}">KindCodex<tspan fill="${terra}">.</tspan></text>
</svg>`;
}
