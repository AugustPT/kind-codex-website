"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressPathProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  "Findability",
  "Clarity",
  "Trust",
  "Conversion",
  "Follow-up",
  "Sales Path",
];

export default function ProgressPath({ currentStep, totalSteps }: ProgressPathProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      {/* Step Numbers & Name Label */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2410c]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          {stepNames[currentStep - 1]}
        </span>
      </div>

      {/* SVG Path Bar */}
      <div className="relative w-full h-12 flex items-center">
        {/* Desktop Progress Path (SVG) */}
        <div className="w-full hidden sm:block relative">
          <svg viewBox="0 0 800 40" className="w-full h-auto overflow-visible">
            {/* Background path line */}
            <line
              x1="20"
              y1="20"
              x2="780"
              y2="20"
              stroke="#e7e5e4"
              strokeWidth="1.5"
            />
            
            {/* Progress line */}
            <motion.line
              x1="20"
              y1="20"
              x2="780"
              y2="20"
              stroke="#c2410c"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: (currentStep - 1) / (totalSteps - 1),
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Nodes */}
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const x = 20 + (idx * 760) / (totalSteps - 1);
              const isCompleted = idx + 1 < currentStep;
              const isActive = idx + 1 === currentStep;

              return (
                <g key={idx}>
                  {/* Glowing Outer Ring for Active Node */}
                  {isActive && (
                    <motion.circle
                      cx={x}
                      cy={20}
                      r={10}
                      fill="none"
                      stroke="rgba(194, 65, 12, 0.15)"
                      strokeWidth="3"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Node Circle */}
                  <circle
                    cx={x}
                    cy={20}
                    r={isActive ? 5 : 3.5}
                    className={`${
                      isCompleted
                        ? "fill-[#c2410c] stroke-[#c2410c]"
                        : isActive
                        ? "fill-[#faf9f5] stroke-[#c2410c]"
                        : "fill-[#faf9f5] stroke-stone-300"
                    } transition-all duration-300`}
                    strokeWidth="1.5"
                  />

                  {/* Node Number Label */}
                  <text
                    x={x}
                    y={36}
                    textAnchor="middle"
                    className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? "fill-[#c2410c]" : "fill-stone-400"
                    }`}
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile Simple Progress Bar */}
        <div className="w-full sm:hidden">
          <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#c2410c]"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
