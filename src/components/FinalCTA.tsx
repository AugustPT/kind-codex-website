"use client";

import React from "react";
import { motion } from "framer-motion";

interface FinalCTAProps {
  onStartPath: () => void;
  onBookCall: () => void;
}

export default function FinalCTA({ onStartPath, onBookCall }: FinalCTAProps) {
  return (
    <section className="w-full py-24 md:py-32 bg-[#faf9f5] flex flex-col items-center justify-center border-t border-stone-200 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 text-center z-10 flex flex-col items-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 max-w-2xl leading-tight tracking-tight"
        >
          Build the path customers need to choose you.
        </motion.h2>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <button
            onClick={onStartPath}
            className="px-8 py-4 bg-[#c2410c] hover:bg-[#9a3412] text-stone-50 font-bold rounded-lg transition-all duration-300 shadow-[0_4px_16px_rgba(194,65,12,0.15)] active:scale-98 cursor-pointer"
          >
            Start the Clarity Path
          </button>
          
          {/* Secondary CTA */}
          <button
            onClick={onBookCall}
            className="px-8 py-4 bg-transparent hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-stone-400 font-bold rounded-lg transition-all duration-300 active:scale-98 cursor-pointer"
          >
            Book a 15-minute clarity call
          </button>
        </motion.div>
      </div>
    </section>
  );
}
