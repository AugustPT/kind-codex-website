"use client";

import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DiagnosticResult } from "@/lib/types";
import Hero from "@/components/Hero";
import ClarityPath from "@/components/ClarityPath";
import ResultScreen from "@/components/ResultScreen";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import ServiceCards from "@/components/ServiceCards";
import CustomerPath from "@/components/CustomerPath";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const pathRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleStartPath = () => {
    pathRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCompletePath = (result: DiagnosticResult, finalAnswers: Record<string, string>) => {
    setDiagnosticResult(result);
    setAnswers(finalAnswers);
    
    // Smooth scroll to result screen after a brief delay for rendering
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleResetPath = () => {
    setDiagnosticResult(null);
    setAnswers({});
    // Scroll back to top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" as any });
    }, 50);
  };

  const handleBookCallExternal = () => {
    window.open("https://calendly.com/august-kindcodex", "_blank");
  };

  // 1. Immersive Distraction-free Focus Layout for Completed Path
  if (diagnosticResult) {
    return (
      <div className="flex-1 flex flex-col w-full bg-[#faf9f5] text-[#1c1917] min-h-screen">
        {/* Minimal Editorial Header */}
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

        {/* Unified Results + Booking Card */}
        <main className="flex-1 flex items-center justify-center py-12 px-4 md:py-16 bg-[#faf9f5]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl border border-stone-200 bg-white rounded-2xl shadow-[0_4px_24px_rgba(28,25,23,0.03)] relative overflow-hidden"
          >
            {/* Decorative terracotta border top line */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[#c2410c]" />

            {/* Opportunity result details */}
            <ResultScreen result={diagnosticResult} />

            {/* Lead Form and Custom Scheduling */}
            <LeadCaptureForm result={diagnosticResult} answers={answers} />
          </motion.div>
        </main>
      </div>
    );
  }

  // 2. Full Homepage Layout for Visitors (Path not yet completed)
  return (
    <div className="flex-1 flex flex-col w-full bg-[#faf9f5] text-[#1c1917] overflow-x-hidden">
      {/* 1. Hero */}
      <Hero onStart={handleStartPath} />

      {/* 2. Interactive Clarity Path wrapper */}
      <div ref={pathRef}>
        <ClarityPath onComplete={handleCompletePath} />
      </div>

      {/* 5. Supporting Proof Sections */}
      <ServiceCards />
      <CustomerPath />

      {/* 6. Final CTA */}
      <FinalCTA
        onStartPath={handleStartPath}
        onBookCall={handleBookCallExternal}
      />
    </div>
  );
}
