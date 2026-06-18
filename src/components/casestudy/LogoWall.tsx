"use client";

import Image from "next/image";
import type { CaseStudy } from "@/lib/caseStudies";

// Trust-first logo wall. AREA ships a real wordmark logo; the others are text
// wordmarks. Each card is a button that snaps the deck to that study's panel.
// Kept uniform + desaturated for an agency-grade "trusted by" feel.
const card =
  "flex h-20 w-56 cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white text-center transition-colors hover:border-stone-300 hover:bg-stone-50";

export default function LogoWall({
  studies,
  goTo,
}: {
  studies: CaseStudy[];
  goTo: (panelIndex: number) => void;
}) {
  // Each study sits at panel index (its position in the deck) + 1 (cover is 0).
  const jump = (slug: string) => {
    const i = studies.findIndex((s) => s.slug === slug);
    if (i >= 0) goTo(i + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
        Recent client builds
      </span>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => jump("associated-hawaii")}
          aria-label="Go to the Associated Real Estate Advisors case study"
          className={`${card} px-8`}
        >
          <Image
            src="/casestudies/logos/area.png"
            alt="Associated Real Estate Advisors"
            width={324}
            height={41}
            className="h-6 w-auto opacity-70 grayscale"
          />
        </button>
        <button
          type="button"
          onClick={() => jump("eaton-square")}
          aria-label="Go to the Eaton Square case study"
          className={`${card} px-8`}
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-500">Eaton Square</span>
        </button>
        <button
          type="button"
          onClick={() => jump("irem-hawaii-70th")}
          aria-label="Go to the IREM Hawaii case study"
          className={`${card} px-8`}
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-500">IREM Hawaii</span>
        </button>
        <button
          type="button"
          onClick={() => jump("tlacuaches-808")}
          aria-label="Go to the Tlacuaches 808 case study"
          className={`${card} px-8`}
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-500">Tlacuaches 808</span>
        </button>
        <button
          type="button"
          onClick={() => jump("aloha-property-managers")}
          aria-label="Go to the Aloha Property Managers case study"
          className={`${card} flex-col px-6`}
        >
          <span className="font-serif text-xl font-bold leading-none tracking-tight text-stone-500">Aloha</span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-stone-400">Property Managers</span>
        </button>
      </div>
    </div>
  );
}
