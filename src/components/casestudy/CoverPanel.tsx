import LogoWall from "./LogoWall";
import SecretTrigger from "./SecretTrigger";
import type { CaseStudy } from "@/lib/caseStudies";

// Panel 00 — proof first. Logos before any reading, then swipe into the work.
// Clicking a logo snaps to that study; triple-clicking the headline opens the
// hidden PRYSM iO case study (see SecretTrigger).
export default function CoverPanel({
  studies,
  goTo,
}: {
  studies: CaseStudy[];
  goTo: (panelIndex: number) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
      <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2410c]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c2410c]" />
        Case studies
      </span>
      <h1 className="max-w-xl font-serif text-4xl leading-[1.08] tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
        <SecretTrigger>Real builds for real businesses.</SecretTrigger>
      </h1>
      <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-stone-600">
        Websites and follow-up systems for local business owners losing customers — to a site people can&apos;t find,
        don&apos;t trust, or click through and leave without calling. Different industries, same fixes — here&apos;s the proof.
      </p>
      <div className="mt-10 flex justify-center">
        <LogoWall studies={studies} goTo={goTo} />
      </div>
      <div className="mt-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
        <span className="animate-bounce text-[#c2410c]">↓</span>
        Swipe to explore the work
      </div>
    </div>
  );
}
