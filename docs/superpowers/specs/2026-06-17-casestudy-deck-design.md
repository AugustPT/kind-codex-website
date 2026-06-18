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
| **Deck** | `/casestudy` | Fast, scannable, pain-point framed. A proof-first cover panel (logo wall), one full-viewport panel per case study, then a closing CTA panel. | Snap-scroll slider (the attached reference image's card design). |
| **Detail** | `/casestudy/[slug]` | The full narrative for one project. Reuses the adapted long-form copy. | Normal long-scroll editorial page (the first detail mockup). |

`View case study →` on a deck panel opens that study's detail page.

## 3. Content (launch = cover + 2 real studies + CTA)

### Cover panel (panel 00 — proof first)
The deck opens on a cover panel whose only job is **instant trust before any reading** (the halo effect): a confident one-line positioning statement plus a **wall of real business logos** from delivered work. Visitors absorb the proof, then swipe into the case studies already trusting the work.

- Positioning headline (serif), e.g. "Real builds for real businesses." / "Proof, not promises."
- Logo wall: uniform, desaturated (stone/ink) logos for an agency-grade "trusted by" look — not full-colour clutter.
- Sources: only businesses genuinely connected to the work — direct clients (Associated Real Estate Advisors, Eaton Square) and the Eaton Square directory tenants actually catalogued. **Requires real logo assets** from the user, or permission to pull them from the delivered sites. No invented logos.
- Swipe/scroll cue into panel 01.

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
- Live builds: the **field-capture app** (`eaton-square-field-capture.vercel.app`) is the centerpiece — proof of *first-principles thinking* (solve discovery at the source before building the public site), not just a pretty front-end. The detail page leads with the capture system (field workflow: map → call → guided interview → photos; recorded/transcribed interviews; tools: Call, Map, Report, Guided Interview, Photo Guide), then frames the public directory (`eatonsquarehi.com`) as stage two it made possible.
- Panel screenshot: public directory (`eatonsquarehi.com`); detail page screenshots both the capture app and the directory.
- Detail slug: `eaton-square`

### Closing CTA panel (final panel in the deck)
Single value-first CTA with premium restraint (see §7).

Copy is **adapted for web** from the user-provided source docs: meaning and structure preserved, tightened for scannability, pull-quotes pulled from the strongest lines. No fabricated metrics — both studies are qualitative/opportunity-framed, so the detail pages stay narrative.

## 4. Architecture

```
src/app/casestudy/page.tsx            Server: metadata. Renders <CaseStudyDeck studies={caseStudies}/>.
src/app/casestudy/[slug]/page.tsx     Server: generateStaticParams + generateMetadata. Renders <CaseStudyDetail study/>.
src/lib/caseStudies.ts                Typed CaseStudy[] data (single source of truth).
src/components/casestudy/
  CaseStudyDeck.tsx        Client. Snap container, scroll-spy, jump-to, keyboard + touch guard.
  CoverPanel.tsx           Opening deck panel: positioning line + LogoWall (proof first).
  LogoWall.tsx             Uniform desaturated business-logo grid.
  DeckNav.tsx              Top jump-nav (desktop tabs / mobile hamburger sheet) + right-edge progress rail + pager.
  CaseStudyPanel.tsx       One full-viewport panel (reference-image layout) + BrowserFrame preview.
  ClosingCtaPanel.tsx      Final deck panel: the value-first CTA.
  CaseStudyDetail.tsx      Client. Long-form detail page from the flexible section model.
  CaseStudyHeader.tsx      Minimal header for detail page: logo → home, "← All case studies".
  BrowserFrame.tsx         Reusable browser-chrome wrapper around a screenshot + live link.
public/casestudies/
  associated-hawaii.png    Captured during implementation (fallback: hand-built frame).
  eaton-square.png         Public directory (panel + detail).
  eaton-square-capture.png Field-capture app (detail centerpiece).
  logos/                   Real business logos for the cover wall (user-provided).
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
- `IntersectionObserver` (threshold ~0.55) tracks the active panel → drives the active nav tab, the `NN / NN` pager, and the right-edge progress rail. The pager and jump-nav count case-study panels only; the cover (00) and closing-CTA panels are not numbered.
- Jump-nav and pager arrows call `panel.scrollIntoView({ behavior: 'smooth' })` (respecting reduced-motion).
- Desktop: horizontal pain-point tabs (industry tag + pain phrase). Mobile: hamburger opens a sheet listing the same items.

**Keyboard:** `ArrowDown`/`PageDown`/`Space` → next, `ArrowUp`/`PageUp` → prev, `Home`/`End` → first/last. Focus moves to the newly active panel's heading.

**Accessibility:**
- `sr-only` h1 on the page; each panel is a `<section aria-label="Case study: …">`.
- Nav items are real `<button>`/`<a>` with `aria-current` on the active one.
- `@media (prefers-reduced-motion: reduce)`: disable smooth scroll + Framer entrance animations; snapping still works.

**Detail pages do NOT snap** — they are normal long-scroll editorial pages.

## 7. CTA spec (value-first, premium restraint)

Used on the closing deck panel and at the bottom of every detail page. Hormozi *structure* (one dominant value-first action, the call demoted to a quiet link) with Apple *restraint* (no de-risking badges — confidence, not disclaimers).

- Primary (terracotta button): **"Start the Clarity Path →"**
- Optional single calm line: *"See what your business is missing."* — or nothing. No "free / 60 seconds / no pitch" badges.
- Destination: `/` (the homepage Clarity Path diagnostic).
- Quiet secondary text link: *"Or book a 15-minute call"* → `https://calendly.com/august-kindcodex`.

Rationale: the audience here is already warm (they just saw proof), and the brand is premium/editorial — so confidence outsells friction-reduction. Direct-response de-risking microcopy reads as "funnel" and cheapens the page; state the value once and let it stand. Final copy lives in one component and is trivial to swap.

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

1. **Logo wall assets** — which businesses to feature, and can you send the logo files (or OK to pull them from the delivered sites)? This is the one hard dependency for the cover panel.
2. **Cover headline** wording ("Real builds for real businesses." vs "Proof, not promises." vs your line).
3. **Eaton Square** — confirm the field-capture app is the featured centerpiece, directory as stage two.
4. **Pain nav labels / panel headlines** — wording good, or tweak?
5. **CTA copy** — "Start the Clarity Path" + optional "See what your business is missing", call demoted to a quiet link. Keep?
