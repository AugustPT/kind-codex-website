"use client";

import React from "react";
import { motion } from "framer-motion";
import { DiagnosticResult } from "../lib/types";

interface ResultScreenProps {
  result: DiagnosticResult;
}

export default function ResultScreen({ result }: ResultScreenProps) {
  return (
    <div className="w-full text-center px-6 sm:px-8 pt-12 pb-4">
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

      {/* Thin separator */}
      <div className="mt-8 border-t border-stone-150" />
    </div>
  );
}
