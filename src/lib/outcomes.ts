import { Question, DiagnosticResult } from "./types";

// Outcome-specific landing pages. Each one is a narrow, single-problem version
// of the home "Clarity Path" — same UI/design, different questions + message —
// so the free audit (lead magnet) points straight at one paid offer.

export interface OutcomeConfig {
  source: string; // tags every lead so they stay sorted by which page they came from
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    steps: string[];
  };
  questions: Question[];
  result: DiagnosticResult;
  // Supporting sections — same design as the homepage, copy tailored to this
  // one outcome so the whole page tells a single story.
  serviceCards: {
    eyebrow: string;
    heading: string;
    cards: { title: string; description: string }[];
  };
  customerPath: { eyebrow: string; heading: string; steps: string[] };
  finalCta: { headline: string; primaryLabel: string; secondaryLabel: string };
}

// No scoring needed: a narrow page funnels to ONE clear recommendation.
const q = (
  id: string,
  number: number,
  question: string,
  answers: string[],
  insight: string
): Question => ({
  id,
  number,
  category: "lead",
  question,
  answers: answers.map((text) => ({ text, weights: {} })),
  insight,
});

// ---------- Outcome 1: Never miss a lead (capture) ----------
export const neverMissALead: OutcomeConfig = {
  source: "never-miss-a-lead",
  hero: {
    eyebrow: "For Real Estate Agents",
    headline: "How many leads slipped through the cracks last month?",
    subheadline: "Take the 60-second Lead Leak Audit and find out what it's costing you.",
    ctaLabel: "Start the Lead Leak Audit",
    steps: ["Capture", "Alert", "Track", "Follow up", "Close"],
  },
  questions: [
    q("sources", 1, "Where do most of your leads come from?", [
      "Zillow / portals",
      "Referrals",
      "Social media",
      "My website",
      "A mix of everything",
    ], "Leads from everywhere are the easiest to lose track of."),
    q("speed", 2, "When a new lead comes in, how fast do you usually respond?", [
      "Within 5 minutes",
      "Within an hour",
      "A few hours later",
      "Next day",
      "Honestly, it varies",
    ], "Speed-to-lead is the #1 thing that wins the deal."),
    q("tracking", 3, "How do you track your leads right now?", [
      "A real CRM",
      "A spreadsheet",
      "Texts and notes",
      "Mostly my memory",
      "Nothing consistent",
    ], "If a lead lives in your head, it's already half-lost."),
    q("slipped", 4, "Last month, how many leads slipped through without a real follow-up?", [
      "None that I know of",
      "1–3",
      "4–10",
      "More than 10",
      "No idea — that's the problem",
    ], "The leads you never followed up on are pure lost commission."),
    q("worth", 5, "What's one closed deal worth to you in commission?", [
      "Under $5k",
      "$5k–$10k",
      "$10k–$20k",
      "$20k+",
    ], "One saved deal usually pays for a whole system many times over."),
    q("impact", 6, "If every lead got caught and followed up instantly, what would that mean?", [
      "A game-changer",
      "Significant",
      "Nice to have",
      "Not sure yet",
    ], "Catching every lead isn't extra work — it's found money."),
  ],
  result: {
    category: "followUp",
    headline: "You're leaking leads to slow follow-up.",
    summary:
      "Leads are coming in faster than they can be caught, and the ones that sit go cold. Every missed lead is a commission you already paid to generate.",
    recommendedFocus: [
      "Instant capture from every lead source",
      "An alert the second a new lead arrives",
      "One organized place for every lead",
      "Follow-up reminders so none go cold",
      "See exactly where each lead came from",
    ],
    cta: "Book a 15-minute call",
  },
  serviceCards: {
    eyebrow: "What we build",
    heading: "Your lead-catching system",
    cards: [
      { title: "Instant Capture", description: "Every lead from every source lands in one place the second it comes in." },
      { title: "Real-Time Alerts", description: "Get pinged the moment a new lead arrives, so you're the first to respond." },
      { title: "One Organized List", description: "No more leads buried in texts, inboxes, and sticky notes." },
      { title: "Automatic Follow-Up", description: "Reminders keep every lead warm so none of them ever go cold." },
      { title: "Source Tracking", description: "See exactly which channel each lead came from, at a glance." },
      { title: "Never Lose a Deal", description: "Catch the leads you're already paying to generate." },
    ],
  },
  customerPath: {
    eyebrow: "How it works",
    heading: "The path every lead follows",
    steps: [
      "Lead comes in.",
      "Instantly captured.",
      "You get alerted.",
      "Followed up fast.",
      "Tracked to close.",
      "Nothing slips.",
    ],
  },
  finalCta: {
    headline: "Stop losing deals to leads that slip through.",
    primaryLabel: "Start the Lead Leak Audit",
    secondaryLabel: "Book a 15-minute call",
  },
};

// ---------- Outcome 2: Sort my leads (qualify/organize) ----------
export const sortMyLeads: OutcomeConfig = {
  source: "sort-my-leads",
  hero: {
    eyebrow: "For Real Estate Agents",
    headline: "Are you spending your time on the wrong leads?",
    subheadline: "Take the 60-second audit and see how much faster a sorted pipeline could move.",
    ctaLabel: "Start the Lead Sorting Audit",
    steps: ["Capture", "Qualify", "Sort", "Prioritize", "Close"],
  },
  questions: [
    q("type", 1, "What kind of leads are you trying to sort?", [
      "Buyers",
      "Sellers",
      "Renters / applicants",
      "A mix of all",
    ], "Different leads need different next steps — sorting starts there."),
    q("decide", 2, "How do you decide who's actually qualified right now?", [
      "Gut feeling",
      "A manual checklist",
      "A form they fill out",
      "I don't really qualify",
      "It varies",
    ], "If qualifying is in your head, it doesn't scale."),
    q("time", 3, "How long to figure out if a new lead is worth pursuing?", [
      "Instant",
      "A few minutes",
      "A whole call",
      "Hours of back-and-forth",
    ], "Time spent qualifying by hand is time not spent closing."),
    q("notyet", 4, "Where do 'not yet' or unqualified leads end up?", [
      "An organized list",
      "Lost in my inbox",
      "I usually forget them",
      "Nowhere, really",
    ], "Most 'not yet' leads are future deals you're letting evaporate."),
    q("volume", 5, "How many leads do you handle in a typical month?", [
      "Under 10",
      "10–30",
      "30–100",
      "100+",
    ], "The more volume, the more a sorting system pays off."),
    q("impact", 6, "If leads auto-sorted into approved / not-yet / unqualified, how helpful?", [
      "Huge",
      "Helpful",
      "Minor",
      "Not sure",
    ], "Sorted leads mean you always work your best opportunity first."),
  ],
  result: {
    category: "conversion",
    headline: "You're spending time on the wrong leads.",
    summary:
      "Without a system, qualified and unqualified leads blur together — so your best opportunities wait while you sort everything by hand.",
    recommendedFocus: [
      "Auto-qualify every new lead",
      "Sort into approved / not-yet / unqualified",
      "Surface your best leads first",
      "Keep 'not yet' leads warm, not lost",
      "Custom rules built around your process",
    ],
    cta: "Book a 15-minute call",
  },
  serviceCards: {
    eyebrow: "What we build",
    heading: "Your lead-sorting system",
    cards: [
      { title: "Auto-Qualify", description: "Every new lead is scored against your criteria the moment it arrives." },
      { title: "Smart Sorting", description: "Leads drop into approved, not-yet, and unqualified — automatically." },
      { title: "Best Leads First", description: "Your highest-value opportunities surface straight to the top." },
      { title: "Keep 'Not Yet' Warm", description: "Future deals stay organized instead of forgotten." },
      { title: "Custom Rules", description: "Built around exactly how you decide who's qualified." },
      { title: "Less Busywork", description: "Stop sorting by hand and get back to closing." },
    ],
  },
  customerPath: {
    eyebrow: "How it works",
    heading: "The path every lead follows",
    steps: [
      "Lead comes in.",
      "Auto-qualified.",
      "Sorted by status.",
      "Prioritized for you.",
      "Worked in order.",
      "Closed faster.",
    ],
  },
  finalCta: {
    headline: "Spend your time on the leads worth closing.",
    primaryLabel: "Start the Lead Sorting Audit",
    secondaryLabel: "Book a 15-minute call",
  },
};
