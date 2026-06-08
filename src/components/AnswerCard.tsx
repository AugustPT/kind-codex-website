"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnswerCardProps {
  text: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function AnswerCard({
  text,
  selected,
  onClick,
  disabled = false,
}: AnswerCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -1, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={`w-full text-left p-5 rounded-xl border text-sm sm:text-base font-semibold transition-all duration-300 relative overflow-hidden flex items-center justify-between group ${
        selected
          ? "bg-stone-100 border-stone-850 shadow-[0_2px_8px_rgba(28,25,23,0.03)] text-stone-900"
          : "bg-white border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-4">
        {/* Customized radio indicator */}
        <span
          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            selected
              ? "border-[#c2410c] bg-[#c2410c]"
              : "border-stone-300 bg-white group-hover:border-stone-400"
          }`}
        >
          {selected && (
            <span className="w-1.5 h-1.5 rounded-full bg-stone-50" />
          )}
        </span>
        <span className="leading-snug">{text}</span>
      </div>

      {/* Indicator arrow */}
      <span
        className={`text-base transition-transform duration-200 group-hover:translate-x-1 ${
          selected ? "text-[#c2410c] translate-x-1" : "text-stone-400 group-hover:text-stone-800"
        }`}
      >
        &rarr;
      </span>
    </motion.button>
  );
}
