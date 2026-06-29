// SINGLE source of truth for the qualifier's questions. Both the email (qualifyEmail.ts)
// and the interactive page (Qualifier.tsx) import from here so the email's first-question
// buttons always match the page's first step. (Previously duplicated with a "MUST match"
// warning — this removes that footgun.)

export interface QStep {
  q: string;
  field: "Timeline" | "Financing" | "Wants";
  opts: string[];
}

export const STEPS: QStep[] = [
  { q: "When are you hoping to make a move?", field: "Timeline", opts: ["ASAP", "1-3 months", "3-6 months", "Just exploring"] },
  { q: "How's financing looking?", field: "Financing", opts: ["Pre-approved", "Talking to a lender", "Cash buyer", "Not yet"] },
  { q: "Want to see it in person?", field: "Wants", opts: ["Book a showing", "Send details + price", "Just text me"] },
];

// The email's first-question buttons.
export const Q1 = { prompt: STEPS[0].q, options: STEPS[0].opts };
