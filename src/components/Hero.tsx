"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroProps {
  onStart: () => void;
}

const steps = ["Find", "Understand", "Trust", "Contact", "Buy"];

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden border-b border-stone-200 bg-[#faf9f5] flex items-center">
      {/* Subtle background paper highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(194,65,12,0.02),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full z-10">
        {/* Asymmetrical 12-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Content Focus) - spans 7 columns */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            
            {/* Animated Eyebrow / Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-100/60 text-[9px] font-bold uppercase tracking-widest text-stone-600 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
              KindCodex Platform
            </motion.div>

            {/* Headline with elegant serif font */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-900 tracking-tight leading-[1.12]"
            >
              What’s stopping your business from getting more customers?
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-stone-600 max-w-xl font-medium leading-relaxed"
            >
              Follow the path. See what your business is missing.
            </motion.p>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={onStart}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-stone-50 font-bold rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(28,25,23,0.06)] hover:shadow-[0_12px_24px_rgba(194,65,12,0.12)] transition-all duration-300 transform active:scale-98 cursor-pointer"
              >
                Start the Clarity Path
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Right Column (Visual Balance) - spans 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 w-full flex justify-center lg:justify-end select-none"
          >
            <div className="w-full max-w-md relative p-6 bg-white border border-stone-200/60 rounded-2xl shadow-[0_4px_20px_rgba(28,25,23,0.015)]">
              {/* Dynamic SVG vertical/diagonal indicator map */}
              <svg viewBox="0 0 280 340" className="w-full h-auto overflow-visible">
                {/* Connecting background pipeline */}
                <path
                  d="M 50,50 L 230,110 L 50,170 L 230,230 L 50,290"
                  fill="none"
                  stroke="rgba(28, 25, 23, 0.08)"
                  strokeWidth="1.5"
                />

                {/* Animated progress flow */}
                <motion.path
                  d="M 50,50 L 230,110 L 50,170 L 230,230 L 50,290"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0.5,
                  }}
                />

                {/* Step Nodes */}
                {steps.map((step, idx) => {
                  const isRight = idx % 2 === 1;
                  const x = isRight ? 230 : 50;
                  const y = 50 + idx * 60;
                  
                  return (
                    <g key={step} className="group">
                      {/* Outer pulse */}
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={8}
                        fill="none"
                        stroke="rgba(194, 65, 12, 0.15)"
                        strokeWidth="2"
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4 }}
                      />
                      
                      {/* Center Node dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={4.5}
                        className="fill-[#faf9f5] stroke-stone-300 group-hover:stroke-stone-900"
                        strokeWidth="1.5"
                      />

                      {/* Text Label aligned opposite to the node dot */}
                      <text
                        x={isRight ? 210 : 70}
                        y={y + 4}
                        textAnchor={isRight ? "end" : "start"}
                        className="text-[10px] font-bold fill-stone-400 group-hover:fill-stone-950 transition-colors duration-200 uppercase tracking-widest"
                      >
                        {step}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
