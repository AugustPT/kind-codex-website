"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DiagnosticResult } from "@/lib/types";
import { OutcomeConfig } from "@/lib/outcomes";
import Hero from "@/components/Hero";
import ClarityPath from "@/components/ClarityPath";
import ResultScreen from "@/components/ResultScreen";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import ServiceCards from "@/components/ServiceCards";
import CustomerPath from "@/components/CustomerPath";
import FinalCTA from "@/components/FinalCTA";

// Identical structure/design to the homepage (src/app/page.tsx), but driven by
// an OutcomeConfig so each landing page has its own questions, message, and
// source tag. The homepage itself is untouched.
export default function AuditExperience({ config }: { config: OutcomeConfig }) {
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPathActive, setIsPathActive] = useState(false);

  const handleStartPath = () => {
    setIsPathActive(true);
    window.scrollTo({ top: 0, behavior: "instant" as any });
  };

  const handleCompletePath = (
    result: DiagnosticResult,
    finalAnswers: Record<string, string>
  ) => {
    setDiagnosticResult(result);
    setAnswers(finalAnswers);
    window.scrollTo({ top: 0, behavior: "instant" as any });
  };

  const handleResetPath = () => {
    setDiagnosticResult(null);
    setIsPathActive(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "instant" as any });
  };

  const handleBookCallExternal = () => {
    window.open("https://calendly.com/august-kindcodex", "_blank");
  };

  // 1. Completed audit → result + lead form
  if (diagnosticResult) {
    return (
      <div className="flex-1 flex flex-col w-full bg-[#faf9f5] text-[#1c1917] min-h-screen">
        <header className="w-full py-6 px-6 border-b border-stone-200 bg-[#faf9f5]">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <span className="font-serif font-bold text-xl tracking-tight text-stone-900">
              KindCodex<span className="text-[#c2410c]">.</span>
            </span>
            <button
              onClick={handleResetPath}
              className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              ← Restart Audit
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12 px-4 md:py-16 bg-[#faf9f5]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl border border-stone-200 bg-white rounded-2xl shadow-[0_4px_24px_rgba(28,25,23,0.03)] relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[#c2410c]" />
            <ResultScreen result={diagnosticResult} />
            <LeadCaptureForm
              result={diagnosticResult}
              answers={answers}
              source={config.source}
            />
          </motion.div>
        </main>
      </div>
    );
  }

  // 2. Active audit (answering questions)
  if (isPathActive) {
    return (
      <div className="flex-1 flex flex-col w-full bg-[#faf9f5] text-[#1c1917] min-h-screen">
        <header className="w-full py-6 px-6 border-b border-stone-200 bg-[#faf9f5]">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <span className="font-serif font-bold text-xl tracking-tight text-stone-900">
              KindCodex<span className="text-[#c2410c]">.</span>
            </span>
            <button
              onClick={handleResetPath}
              className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center bg-[#faf9f5]">
          <ClarityPath
            onComplete={handleCompletePath}
            questions={config.questions}
            onCalculate={() => config.result}
          />
        </main>
      </div>
    );
  }

  // 3. Landing (not started) — same sections + design as the homepage
  return (
    <div className="flex-1 flex flex-col w-full bg-[#faf9f5] text-[#1c1917] overflow-x-hidden">
      <Hero
        onStart={handleStartPath}
        eyebrow={config.hero.eyebrow}
        headline={config.hero.headline}
        subheadline={config.hero.subheadline}
        ctaLabel={config.hero.ctaLabel}
        steps={config.hero.steps}
      />
      <ServiceCards
        eyebrow={config.serviceCards.eyebrow}
        heading={config.serviceCards.heading}
        cards={config.serviceCards.cards}
      />
      <CustomerPath
        eyebrow={config.customerPath.eyebrow}
        heading={config.customerPath.heading}
        steps={config.customerPath.steps}
      />
      <FinalCTA
        onStartPath={handleStartPath}
        onBookCall={handleBookCallExternal}
        headline={config.finalCta.headline}
        primaryLabel={config.finalCta.primaryLabel}
        secondaryLabel={config.finalCta.secondaryLabel}
      />
    </div>
  );
}
