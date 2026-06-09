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

  const handleBookCallExternal = () => {
    window.open("https://calendly.com/august-kindcodex", "_blank");
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-[#faf9f5] text-[#1c1917] overflow-x-hidden">
      {/* 1. Hero */}
      <Hero onStart={handleStartPath} />

      {/* 2. Interactive Clarity Path wrapper */}
      <div ref={pathRef}>
        <ClarityPath onComplete={handleCompletePath} />
      </div>

      {/* 3 & 4. Merged Opportunity and Lead Capture Funnel (Dynamic Reveal) */}
      <AnimatePresence mode="wait">
        {diagnosticResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" as const }}
            className="w-full bg-[#faf9f5]"
          >
            <div ref={resultRef} className="py-16 md:py-24 px-4 border-b border-stone-200">
              <div className="w-full max-w-2xl mx-auto border border-stone-200 bg-white rounded-2xl shadow-[0_4px_24px_rgba(28,25,23,0.03)] relative overflow-hidden">
                {/* Decorative terracotta border top line */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-[#c2410c]" />

                {/* Opportunity result details */}
                <ResultScreen result={diagnosticResult} />

                {/* Lead Form and Calendly Booking */}
                <LeadCaptureForm result={diagnosticResult} answers={answers} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
