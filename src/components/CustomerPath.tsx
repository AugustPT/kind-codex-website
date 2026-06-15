"use client";

import React from "react";
import { motion } from "framer-motion";

const DEFAULT_STEPS = [
  "Find you.",
  "Understand you.",
  "Trust you.",
  "Contact you.",
  "Buy from you.",
  "Come back again.",
];

interface CustomerPathProps {
  eyebrow?: string;
  heading?: string;
  steps?: string[];
}

export default function CustomerPath({
  eyebrow = "Architectural Design",
  heading = "The customer path we build",
  steps: pathSteps = DEFAULT_STEPS,
}: CustomerPathProps) {
  return (
    <section className="w-full py-20 md:py-32 bg-[#faf9f5] border-b border-stone-200 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section title */}
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-[9px] font-bold tracking-widest text-[#c2410c] uppercase bg-stone-100 border border-stone-200/60 px-3 py-1 rounded-md mb-4 inline-block">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 max-w-lg mx-auto leading-tight">
            {heading}
          </h2>
        </div>

        {/* Visual progress line container */}
        <div className="relative w-full py-10">
          {/* Desktop Layout */}
          <div className="hidden lg:block relative w-full">
            {/* Background thin path line */}
            <div className="absolute top-6 left-[8.33%] right-[8.33%] h-0.5 bg-stone-200 pointer-events-none" />
            
            {/* Animated glowing path line */}
            <motion.div
              className="absolute top-6 left-[8.33%] h-0.5 bg-[#c2410c] origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ width: "83.33%" }}
            />

            {/* Path Stages Grid */}
            <div className="grid grid-cols-6 gap-4 relative">
              {pathSteps.map((step, idx) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="flex flex-col items-center text-center group relative"
                >
                  {/* Node dot */}
                  <div className="w-12 h-12 rounded-full border border-stone-200 bg-white flex items-center justify-center relative z-10 mb-6 group-hover:border-[#c2410c] transition-colors duration-300">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: [0.8, 1.1, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.2 + 0.3 }}
                      className="w-2.5 h-2.5 rounded-full bg-[#c2410c]"
                    />
                  </div>

                  {/* Flow Arrow pointing to next node */}
                  {idx < pathSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-4 left-[calc(100%-12px)] w-6 h-4 items-center justify-center text-stone-300 font-bold text-sm pointer-events-none select-none z-20">
                      &rarr;
                    </div>
                  )}

                  {/* Step label */}
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                    Phase 0{idx + 1}
                  </span>
                  
                  {/* Step Title */}
                  <h3 className="text-sm font-extrabold text-stone-800 group-hover:text-[#c2410c] transition-colors duration-300">
                    {step}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Layout */}
          <div className="lg:hidden relative pl-8 sm:pl-16">
            {/* Vertical background line */}
            <div className="absolute top-4 bottom-4 left-4 sm:left-12 w-0.5 bg-stone-200 pointer-events-none" />
            
            {/* Vertical progress line */}
            <motion.div
              className="absolute top-4 left-4 sm:left-12 w-0.5 bg-[#c2410c] origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ bottom: "16px" }}
            />

            {/* Stages Stack */}
            <div className="space-y-12">
              {pathSteps.map((step, idx) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex gap-6 items-start relative group"
                >
                  {/* Node Dot */}
                  <div className="absolute -left-6 sm:-left-6 w-8 h-8 rounded-full border border-stone-200 bg-white flex items-center justify-center z-10 -translate-x-1/2 group-hover:border-[#c2410c] transition-colors duration-300">
                    <div className="w-2 h-2 rounded-full bg-[#c2410c]" />
                  </div>

                  {/* Labels */}
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                      Phase 0{idx + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-stone-850 group-hover:text-[#c2410c] transition-colors duration-300">
                      {step}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
