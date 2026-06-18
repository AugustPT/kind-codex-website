# Case Study Deck — Design Spec

Date: 2026-06-17
Route: `/casestudy` (+ `/casestudy/[slug]`)
Status: Awaiting user review

## 1. Goal

A `/casestudy` experience that doubles as a **sales asset** (pitched in person via QR codes, per the existing `/go` funnel) and a **credibility/SEO surface**. It must:

- Feel premium and editorial, matching the existing KindCodex brand system.
- Lead with **the pain we solved**, not the client name.
- Present as a **full-screen vertical deck**: one case study per viewport, snapping on swipe, with intentional (non-free) scrolling on mobile.
- Let visitors **jump by pain point** via top/side navigation.
- Link each panel to a **long-form detail page** for prospects who want the full story.

## 2. Two-layer concept

| Layer | Route | Purpose | Feel |
|---|---|---|---|
| **Deck** | `/casestudy` | Fast, scannable, pain-point framed. One full-viewport panel per case study + a closing CTA panel. | Snap-scroll slider (the attached reference image's card design). |
| **Detail** | `/casestudy/[slug]` | The full narrative for one project. Reuses the adapted long-form copy. | Normal long-scroll editorial page (the first detail mockup). |

`View case study →` on a deck panel opens that study's detail page.

## 3. Content (launch = 2 real studies + CTA)

### Panel 01 — Associated Hawaii
- Industry tag: `Real estate`
- Pain nav label: `Trust before the first call`
- Panel headline: "Earning trust before the first phone call"
- Summary: "How we turned a real estate listings page into Oʻahu's relocation guide — so off-island buyers arrive already trusting the team."
- Live build (panel screenshot): `associated-hawaii.vercel.app`
- Detail slug: `associated-hawaii`

### Panel 02 — Eaton Square
- Industry tag: `Shopping center`
- Pain nav label: `Noticed, not walked past`
- Panel headline: "Turning a place you'd walk past into one you stop for"
- Summary: "We built a field-capture system that turned a hidden shopping center into a clear, living business directory."
- Live build (panel screenshot): `eatonsquarehi.com` (public directory). Detail page also references the capture build at `eaton-square-field-capture.vercel.app`.
- Detail slug: `eaton-square`

### Closing CTA panel (final panel in the deck)
Hormozi-style single value-first CTA (see §7).

Copy is **adapted for web** from the user-provided source docs: meaning and structure preserved, tightened for scannability, pull-quotes pulled from the strongest lines. No fabricated metrics — both studies are qualitative/opportunity-framed, so the detail pages stay narrative.

## 4. Architecture

```
src/app/casestudy/page.tsx            Server: metadata. Renders <CaseStudyDeck studies={caseStudies}/>.
src/app/casestudy/[slug]/page.tsx     Server: generateStaticParams + generateMetadata. Renders <CaseStudyDetail study/>.
src/lib/caseStudies.ts                Typed CaseStudy[] data (single source of truth).
src/components/casestudy/
  CaseStudyDeck.tsx        Client. Snap container, scroll-spy, jump-to, keyboard + touch guard.
  DeckNav.tsx              Top jump-nav (desktop tabs / mobile hamburger sheet) + right-edge progress rail + pager.
  CaseStudyPanel.tsx       One full-viewport panel (reference-image layout) + BrowserFrame preview.
  ClosingCtaPanel.tsx      Final deck panel: the Hormozi CTA.
  CaseStudyDetail.tsx      Client. Long-form detail page from the flexible section model.
  CaseStudyHeader.tsx      Minimal header for detail page: logo → home, "← All case studies".
  BrowserFrame.tsx         Reusable browser-chrome wrapper around a screenshot + live link.
public/casestudies/
  associated-hawaii.png    Captured during implementation (fallback: hand-built frame).
  eaton-square.png
src/app/sitemap.ts         Add /casestudy and each /casestudy/[slug].
```

Reuses the existing design system (cream `#faf9f5` / stone ink `#1c1917` / terracotta `#c2410c`, Playfair + Plus Jakarta, Framer Motion 12) and the standalone-page shell pattern (server page with metadata → client component). New primitives are only `BrowserFrame`, the deck mechanics, and the two layouts.

## 5. Data model

`src/lib/caseStudies.ts`. A flexible **section array** on `detail` so studies with different section sets (Eaton Square adds "How the capture build worked" and "Stage two") and future studies all fit one shape.

```ts
export interface CaseStudy {
  slug: string;
  order: number;
  industry: string;        // nav tag, e.g. "Real estate"
  painNav: string;         // short pain phrase for nav, e.g. "Trust before the first call"
  headline: string;        // panel serif headline (pain-led)
  summary: string;         // panel subhead (1–2 lines)
  liveUrl: string;         // primary live build shown in the panel
  screenshot: string;      // /casestudies/<slug>.png
  detail: CaseStudyDetail;
}

export interface CaseStudyDetail {
  title: string;           // detail hero headline
  client: string;          // e.g. "Associated Real Estate Advisors"
  metaChips: string[];     // e.g. ["Real estate · Oʻahu, HI", "Trust funnel", "Guided website"]
  liveLinks: { label: string; url: string }[];  // 1+ (Eaton has directory + capture app)
  sections: Section[];
}

export type Section =
  | { kind: 'prose'; eyebrow: string; body: string[]; pullQuote?: string }
  | { kind: 'cards'; eyebrow: string; intro?: string; items: { title: string; desc?: string }[] }
  | { kind: 'list';  eyebrow: string; intro?: string; items: string[] }   // questions / roadmap (terracotta markers)
  | { kind: 'steps'; eyebrow: string; intro?: string; items: string[] }   // ordered workflow / progression
  | { kind: 'quote'; eyebrow: string; quote: string };                    // closing pull-quote
```

Adding a study later = append one `CaseStudy` object + one screenshot. No route/markup changes.

## 6. Interaction spec (the deck)

**Snap mechanism (CSS-first):**
- Container: `height: 100dvh; overflow-y: scroll; scroll-snap-type: y mandatory;`
- Each panel: `height: 100dvh; scroll-snap-align: start; scroll-snap-stop: always;`
- `scroll-snap-stop: always` is what enforces "one panel per swipe / no skipping on a fast flick" — the core of "every swipe is intentional."

**Touch guard (JS enhancement):** a lightweight wheel/touch handler ensures a single gesture advances exactly one panel and ignores further input until the snap settles (covers browsers where `scroll-snap-stop` is loose on fast flicks). Degrades gracefully to pure CSS if JS disabled.

**Navigation / scroll-spy:**
- `IntersectionObserver` (threshold ~0.55) tracks the active panel → drives the active nav tab, the `NN / NN` pager, and the right-edge progress rail.
- Jump-nav and pager arrows call `panel.scrollIntoView({ behavior: 'smooth' })` (respecting reduced-motion).
- Desktop: horizontal pain-point tabs (industry tag + pain phrase). Mobile: hamburger opens a sheet listing the same items.

**Keyboard:** `ArrowDown`/`PageDown`/`Space` → next, `ArrowUp`/`PageUp` → prev, `Home`/`End` → first/last. Focus moves to the newly active panel's heading.

**Accessibility:**
- `sr-only` h1 on the page; each panel is a `<section aria-label="Case study: …">`.
- Nav items are real `<button>`/`<a>` with `aria-current` on the active one.
- `@media (prefers-reduced-motion: reduce)`: disable smooth scroll + Framer entrance animations; snapping still works.

**Detail pages do NOT snap** — they are normal long-scroll editorial pages.

## 7. CTA spec (Hormozi single value-first)

Used on the closing deck panel and at the bottom of every detail page.

- Primary (terracotta button): **"See what's costing you customers →"**
- Microcopy under it: *"Takes 60 seconds · Free · No call, no pitch"*
- Destination: `/` (the homepage Clarity Path diagnostic).
- Quiet secondary text link: *"Rather talk it through? Book a 15-min call →"* → `https://calendly.com/august-kindcodex`.

Rationale: one dominant, low-friction, value-first action ("a confused mind says no"); the call is demoted to an escape hatch for already-sold readers, not a competing button. Final button copy is easy to swap (lives in one component).

## 8. Screenshots / assets

Capture desktop viewport screenshots of the live builds into `public/casestudies/` during implementation (via the available browser/preview tooling). If a live site blocks automated capture, fall back to a clean hand-built browser mockup using the site's real key text — and flag it rather than shipping a broken image. `BrowserFrame` renders chrome (dots + URL) around whatever image is provided, so the fallback is visually consistent.

## 9. SEO / metadata

- `/casestudy`: title "Case Studies | KindCodex", description framed around problems solved.
- `/casestudy/[slug]`: `generateMetadata` per study (title = pain headline + client, description = summary). `generateStaticParams` for static generation.
- Add both routes to `src/app/sitemap.ts`.

## 10. Out of scope (future)

- Filtering/search across many studies (revisit past ~6 studies).
- Per-study analytics / `?ref=` capture (the deck can inherit the existing ref pattern later).
- Video or interactive embeds inside panels.

## 11. Testing & verification

- `npm run build` + lint clean (App Router dynamic route + static params valid).
- Manual: desktop + mobile widths — snap advances one panel per gesture and stops; jump-nav + pager move correctly; active state tracks; reduced-motion path; `View case study` → correct detail page; CTAs link correctly; screenshots render.
- Per AGENTS.md: **read the relevant Next.js 16 guides in `node_modules/next/dist/docs/` before writing routing/metadata code** — this version diverges from training-data conventions.

## 12. Decisions to confirm at review

1. Eaton Square panel screenshot = public directory (`eatonsquarehi.com`); detail page shows both directory + capture app. OK?
2. Pain nav labels / panel headlines above — wording good, or tweak?
3. Closing CTA button copy ("See what's costing you customers") — keep or change?
