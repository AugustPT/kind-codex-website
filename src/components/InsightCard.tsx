"use client";

import React from "react";
import { motion } from "framer-motion";

interface InsightCardProps {
  insight: string;
}

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full mt-3 sm:mt-6 p-3 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/80 relative overflow-hidden"
    >
      {/* Decorative vertical glowing line */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#c2410c]" />
      
      <div className="flex items-start gap-2 pl-1 sm:pl-2">
        <span className="text-[#c2410c] mt-0.5 select-none font-bold text-xs sm:text-sm" aria-hidden="true">
          ✦
        </span>
        <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-relaxed">
          {insight}
        </p>
      </div>
    </motion.div>
  );
}
