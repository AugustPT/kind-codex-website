"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ServiceCards() {
  return (
    <section className="w-full py-20 md:py-32 bg-[#faf9f5] border-b border-stone-200 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center sm:text-left">
          <span className="text-[9px] font-bold tracking-widest text-[#c2410c] uppercase bg-stone-100 border border-stone-200/60 px-3 py-1 rounded-md mb-4 inline-block">
            Our Focus
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 max-w-xl leading-tight">
            What KindCodex improves
          </h2>
        </div>

        {/* Grid of Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: Better Website */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, borderColor: "rgba(194,65,12,0.4)" }}
            className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden transition-all duration-300 group shadow-[0_2px_8px_rgba(28,25,23,0.01)] flex flex-col justify-between min-h-[360px]"
          >
            {/* Custom SVG Diagram: Layout Clarity */}
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/60 border border-stone-150 rounded-lg mb-6 overflow-hidden relative">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto overflow-visible">
                {/* Browser frame */}
                <rect x="10" y="10" width="180" height="80" rx="4" fill="none" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="10" y1="22" x2="190" y2="22" stroke="#e7e5e4" strokeWidth="1" />
                <circle cx="18" cy="16" r="2" fill="#e7e5e4" />
                <circle cx="24" cy="16" r="2" fill="#e7e5e4" />
                <circle cx="30" cy="16" r="2" fill="#e7e5e4" />
                
                {/* Header bar items */}
                <line x1="150" y1="16" x2="175" y2="16" stroke="#e7e5e4" strokeWidth="2" />
                
                {/* Main clear message (Clarity highlight) */}
                <motion.line 
                  x1="30" 
                  y1="40" 
                  x2="110" 
                  y2="40" 
                  stroke="#1c1917" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                <motion.line 
                  x1="30" 
                  y1="50" 
                  x2="90" 
                  y2="50" 
                  stroke="#c2410c" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                
                <line x1="30" y1="65" x2="170" y2="65" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="30" y1="72" x2="140" y2="72" stroke="#e7e5e4" strokeWidth="1.5" />
                
                {/* Glowing Call-to-action button */}
                <motion.rect
                  x="145"
                  y="34"
                  width="30"
                  height="12"
                  rx="2"
                  className="fill-[#c2410c]"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Better Website
              </h3>
              <p className="text-sm font-semibold text-stone-500 leading-relaxed">
                Customers instantly understand what you do, who you help, and why they should contact you.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Better Calls */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, borderColor: "rgba(194,65,12,0.4)" }}
            className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden transition-all duration-300 group shadow-[0_2px_8px_rgba(28,25,23,0.01)] flex flex-col justify-between min-h-[360px]"
          >
            {/* Custom SVG Diagram: Pre-qualification Timeline */}
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/60 border border-stone-150 rounded-lg mb-6 overflow-hidden relative">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto overflow-visible">
                {/* Question form box */}
                <rect x="15" y="30" width="45" height="40" rx="3" fill="none" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="23" y1="40" x2="43" y2="40" stroke="#e7e5e4" strokeWidth="2" />
                <line x1="23" y1="50" x2="52" y2="50" stroke="#c2410c" strokeWidth="2" />
                <line x1="23" y1="60" x2="38" y2="60" stroke="#e7e5e4" strokeWidth="2" />
                
                {/* Connecting timeline path */}
                <path
                  d="M 68,50 L 132,50"
                  fill="none"
                  stroke="rgba(194, 65, 12, 0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                
                {/* Flow indicator checkbox */}
                <circle cx="100" cy="50" r="10" fill="#faf9f5" stroke="#c2410c" strokeWidth="1.5" />
                <path d="M 97,50 L 99,52 L 103,47" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />

                {/* Telephone box */}
                <rect x="140" y="30" width="45" height="40" rx="3" fill="none" stroke="#e7e5e4" strokeWidth="1.5" />
                <path
                  d="M 152,44 C 152,42 162,42 162,44 L 164,48 C 164,49 162,51 157,51 C 152,51 150,49 148,48 L 152,44 Z"
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth="1.5"
                />
                <circle cx="162" cy="56" r="3" fill="#1c1917" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Better Calls
              </h3>
              <p className="text-sm font-semibold text-stone-500 leading-relaxed">
                The right questions are answered before people reach out, so you get better conversations.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Better Visibility */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, borderColor: "rgba(194,65,12,0.4)" }}
            className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden transition-all duration-300 group shadow-[0_2px_8px_rgba(28,25,23,0.01)] flex flex-col justify-between min-h-[360px]"
          >
            {/* Custom SVG Diagram: Radial Channels */}
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/60 border border-stone-150 rounded-lg mb-6 overflow-hidden relative">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto overflow-visible">
                {/* Central website node */}
                <circle cx="100" cy="50" r="14" fill="#faf9f5" stroke="#1c1917" strokeWidth="2" />
                <rect x="94" y="45" width="12" height="10" rx="1" fill="none" stroke="#1c1917" strokeWidth="1" />
                
                {/* Channel lines */}
                <line x1="65" y1="28" x2="88" y2="42" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="135" y1="28" x2="112" y2="42" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="100" y1="80" x2="100" y2="64" stroke="#e7e5e4" strokeWidth="1.5" />

                {/* Left channel (Google Business / Map Pin) */}
                <circle cx="55" cy="22" r="10" fill="#faf9f5" stroke="#c2410c" strokeWidth="1.5" />
                <path d="M 55,17 C 52,17 50,19 50,22 C 50,25 55,27 55,27 C 55,27 60,25 60,22 C 60,19 58,17 55,17 Z" fill="none" stroke="#c2410c" strokeWidth="1" />
                
                {/* Right channel (Review Stars) */}
                <circle cx="145" cy="22" r="10" fill="#faf9f5" stroke="#c2410c" strokeWidth="1.5" />
                <path d="M 145,17 L 146.5,20 L 149.5,20.5 L 147,22.5 L 148,25.5 L 145,24 L 142,25.5 L 143,22.5 L 140.5,20.5 L 143.5,20 Z" fill="none" stroke="#c2410c" strokeWidth="1" />

                {/* Bottom channel (Photos) */}
                <circle cx="100" cy="80" r="10" fill="#faf9f5" stroke="#c2410c" strokeWidth="1.5" />
                <rect x="95" y="76" width="10" height="8" rx="1" fill="none" stroke="#c2410c" strokeWidth="1" />
                <circle cx="98" cy="79" r="1.5" fill="#c2410c" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Better Visibility
              </h3>
              <p className="text-sm font-semibold text-stone-500 leading-relaxed">
                Your Google Business Profile, photos, reviews, website, and message work together.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Better Tracking */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, borderColor: "rgba(194,65,12,0.4)" }}
            className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden transition-all duration-300 group shadow-[0_2px_8px_rgba(28,25,23,0.01)] flex flex-col justify-between min-h-[360px]"
          >
            {/* Custom SVG Diagram: Funnel & Graph */}
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/60 border border-stone-150 rounded-lg mb-6 overflow-hidden relative">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto overflow-visible">
                {/* Graph Grid */}
                <line x1="20" y1="80" x2="180" y2="80" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="20" y1="20" x2="20" y2="80" stroke="#e7e5e4" strokeWidth="1.5" />
                
                {/* Grid lines */}
                <line x1="20" y1="50" x2="180" y2="50" stroke="#f5f5f4" strokeWidth="1" />
                
                {/* Dynamic graph curve */}
                <motion.path
                  d="M 20,70 Q 60,65 100,45 T 180,25"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
                
                {/* Coordinate dots */}
                <circle cx="100" cy="45" r="3" fill="#1c1917" />
                <circle cx="180" cy="25" r="3" fill="#1c1917" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Better Tracking
              </h3>
              <p className="text-sm font-semibold text-stone-500 leading-relaxed">
                See where people came from, what they clicked, and what made them call, message, or leave.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Better Follow-Up */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, borderColor: "rgba(194,65,12,0.4)" }}
            className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden transition-all duration-300 group shadow-[0_2px_8px_rgba(28,25,23,0.01)] flex flex-col justify-between min-h-[360px]"
          >
            {/* Custom SVG Diagram: Engagement Loop */}
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/60 border border-stone-150 rounded-lg mb-6 overflow-hidden relative">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto overflow-visible">
                {/* Website node */}
                <rect x="80" y="38" width="40" height="24" rx="2" fill="none" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="80" y1="46" x2="120" y2="46" stroke="#e7e5e4" strokeWidth="1" />
                
                {/* Continuous loop line */}
                <path
                  d="M 125,50 C 160,50 160,85 100,85 C 40,85 40,50 75,50"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                
                {/* Loop return indicator chevron */}
                <path d="M 70,46 L 76,50 L 70,54" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
                
                {/* Muted outer nodes */}
                <circle cx="140" cy="50" r="3.5" fill="#e7e5e4" />
                <circle cx="60" cy="50" r="3.5" fill="#e7e5e4" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Better Follow-Up
              </h3>
              <p className="text-sm font-semibold text-stone-500 leading-relaxed">
                Bring back people who looked but did not buy the first time.
              </p>
            </div>
          </motion.div>

          {/* Card 6: Better Sales Path */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, borderColor: "rgba(194,65,12,0.4)" }}
            className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden transition-all duration-300 group shadow-[0_2px_8px_rgba(28,25,23,0.01)] flex flex-col justify-between min-h-[360px]"
          >
            {/* Custom SVG Diagram: Tiered Progression */}
            <div className="w-full h-32 flex items-center justify-center bg-stone-50/60 border border-stone-150 rounded-lg mb-6 overflow-hidden relative">
              <svg viewBox="0 0 200 100" className="w-full max-w-[160px] h-auto overflow-visible">
                {/* Staircase levels */}
                {/* Level 1 */}
                <rect x="30" y="65" width="40" height="15" rx="1.5" fill="none" stroke="#e7e5e4" strokeWidth="1.5" />
                <text x="50" y="75" textAnchor="middle" className="text-[8px] font-bold fill-stone-400 uppercase tracking-widest">Entry</text>
                
                {/* Arrow indicator */}
                <path d="M 74,62 L 84,54" fill="none" stroke="#e7e5e4" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Level 2 */}
                <rect x="80" y="45" width="40" height="15" rx="1.5" fill="none" stroke="#e7e5e4" strokeWidth="1.5" />
                <text x="100" y="55" textAnchor="middle" className="text-[8px] font-bold fill-stone-400 uppercase tracking-widest">Core</text>
                
                {/* Arrow indicator */}
                <path d="M 124,42 L 134,34" fill="none" stroke="#c2410c" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
                
                {/* Level 3 */}
                <rect x="130" y="25" width="40" height="15" rx="1.5" className="stroke-[#c2410c] fill-[#c2410c]/5" strokeWidth="1.5" />
                <text x="150" y="35" textAnchor="middle" className="text-[8px] font-bold fill-[#c2410c] uppercase tracking-widest font-mono">Max</text>
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Better Sales Path
              </h3>
              <p className="text-sm font-semibold text-stone-500 leading-relaxed">
                Help new and existing customers choose the right next step.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
