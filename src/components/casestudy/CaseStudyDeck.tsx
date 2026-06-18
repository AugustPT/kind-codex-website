"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseStudy } from "@/lib/caseStudies";
import DeckNav from "./DeckNav";
import CoverPanel from "./CoverPanel";
import CaseStudyPanel from "./CaseStudyPanel";
import ClosingCtaPanel from "./ClosingCtaPanel";

const pad = (n: number) => String(n).padStart(2, "0");

// Full-screen vertical scroll-snap deck. CSS (snap-mandatory + snap-always on
// 100dvh panels) does the "one intentional swipe per panel" work; JS only
// tracks the active panel and drives the jump-nav / keyboard / pager.
export default function CaseStudyDeck({ studies }: { studies: CaseStudy[] }) {
  const total = studies.length;
  const panelCount = total + 2; // cover + studies + closing CTA

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(panelCount - 1, i));
      const el = panelRefs.current[clamped];
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [panelCount]
  );

  // Track the active panel via the scroll container.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: [0.55] }
    );
    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [panelCount]);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          goTo(activeRef.current + 1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(activeRef.current - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(panelCount - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, panelCount]);

  const panels = [
    { node: <CoverPanel />, label: "Introduction" },
    ...studies.map((study, i) => ({
      node: <CaseStudyPanel study={study} priority={i === 0} />,
      label: `Case study ${i + 1}: ${study.headline}`,
    })),
    { node: <ClosingCtaPanel />, label: "Start the Clarity Path" },
  ];

  const isStudy = activeIndex >= 1 && activeIndex <= total;

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] overflow-y-scroll overscroll-contain snap-y snap-mandatory bg-[#faf9f5] text-stone-900"
    >
      <DeckNav studies={studies} activeIndex={activeIndex} goTo={goTo} />

      {panels.map((p, i) => (
        <section
          key={i}
          data-index={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          aria-label={p.label}
          className="flex h-[100dvh] snap-start snap-always"
        >
          {p.node}
        </section>
      ))}

      {/* Right-edge progress rail */}
      <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 sm:flex">
        {panels.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to panel ${i + 1}`}
            className="flex items-center justify-center py-0.5"
          >
            <span
              className={`block w-1 rounded-full transition-all duration-300 ${
                activeIndex === i ? "h-5 bg-[#c2410c]" : "h-2 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Bottom pager + swipe hint */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {isStudy ? (
            <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white/90 px-2 py-1.5 backdrop-blur">
              <button
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Previous"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:text-stone-900"
              >
                ←
              </button>
              <span className="text-xs font-bold tracking-wide">
                <span className="text-stone-900">{pad(activeIndex)}</span>
                <span className="text-stone-400"> / {pad(total)}</span>
              </span>
              <button
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Next"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-stone-50 transition-colors hover:bg-stone-700"
              >
                →
              </button>
            </div>
          ) : (
            <span />
          )}

          {activeIndex < panelCount - 1 ? (
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <span className="text-[#c2410c]">↓</span> Swipe for next
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
