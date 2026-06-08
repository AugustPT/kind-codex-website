"use client";

import React from "react";
import { motion } from "framer-motion";
import { DiagnosticResult } from "../lib/types";

interface ResultScreenProps {
  result: DiagnosticResult;
  onCtaClick: () => void;
}

export default function ResultScreen({ result, onCtaClick }: ResultScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto px-6 py-12 border border-stone-200 bg-white rounded-2xl shadow-[0_4px_24px_rgba(28,25,23,0.03)] text-center relative overflow-hidden"
    >
      {/* Decorative terracotta border top line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#c2410c]" />

      {/* Result Badge */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-6"
      >
        <span className="text-[#c2410c]">✦</span> Diagnostic Output
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight leading-tight max-w-lg mx-auto"
      >
        {result.headline}
      </motion.h2>

      {/* Summary */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed font-medium"
      >
        {result.summary}
      </motion.p>

      {/* Recommended Focus List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-left max-w-md mx-auto border-t border-stone-150 pt-6"
      >
        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
          Recommended Focus Areas:
        </h3>
        
        <ul className="space-y-3">
          {result.recommendedFocus.map((focus, idx) => (
            <motion.li
              key={focus}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-start gap-3 text-sm font-semibold text-stone-800"
            >
              <span className="text-[#c2410c] mt-0.5 select-none font-bold" aria-hidden="true">
                ✓
              </span>
              <span>{focus}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10 border-t border-stone-150 pt-8"
      >
        <button
          onClick={onCtaClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#c2410c] hover:bg-[#9a3412] text-stone-50 font-bold rounded-lg transition-all duration-300 shadow-[0_4px_16px_rgba(194,65,12,0.15)] hover:shadow-[0_4px_24px_rgba(194,65,12,0.25)] cursor-pointer"
        >
          {result.cta}
          <span className="text-sm">&rarr;</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
