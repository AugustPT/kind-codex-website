"use client";

import { useState } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/caseStudies";

interface DeckNavProps {
  studies: CaseStudy[];
  activeIndex: number; // index across all panels (0 = cover)
  goTo: (panelIndex: number) => void;
}

// Top jump-nav. Desktop shows pain-point tabs; mobile collapses to a sheet.
// Each study lives at panel index (order in array) + 1 (cover is panel 0).
export default function DeckNav({ studies, activeIndex, goTo }: DeckNavProps) {
  const [open, setOpen] = useState(false);

  const jump = (panelIndex: number) => {
    setOpen(false);
    goTo(panelIndex);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-stone-200/70 bg-[#faf9f5]/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-stone-900">
          KindCodex<span className="text-[#c2410c]">.</span>
        </Link>

        {/* Desktop tabs */}
        <div className="hidden items-stretch md:flex">
          {studies.map((study, i) => {
            const panelIndex = i + 1;
            const active = activeIndex === panelIndex;
            return (
              <button
                key={study.slug}
                onClick={() => jump(panelIndex)}
                aria-current={active ? "true" : undefined}
                className={`flex flex-col gap-0.5 border-l border-stone-200 px-4 py-1 text-left transition-colors ${
                  active ? "border-b-2 border-b-[#c2410c]" : ""
                }`}
              >
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
                    active ? "text-[#c2410c]" : "text-stone-400"
                  }`}
                >
                  {study.industry}
                </span>
                <span className={`text-xs font-bold ${active ? "text-stone-900" : "text-stone-500"}`}>
                  {study.painNav}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Case study navigation"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 text-stone-700 md:hidden"
        >
          <span className="text-lg leading-none">{open ? "✕" : "≡"}</span>
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-stone-200 bg-[#faf9f5] md:hidden">
          {studies.map((study, i) => {
            const panelIndex = i + 1;
            const active = activeIndex === panelIndex;
            return (
              <button
                key={study.slug}
                onClick={() => jump(panelIndex)}
                className="flex w-full flex-col gap-0.5 border-b border-stone-100 px-6 py-3 text-left"
              >
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
                    active ? "text-[#c2410c]" : "text-stone-400"
                  }`}
                >
                  {study.industry}
                </span>
                <span className={`text-sm font-bold ${active ? "text-stone-900" : "text-stone-600"}`}>
                  {study.painNav}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
