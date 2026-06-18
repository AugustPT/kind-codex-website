import Link from "next/link";
import type { CaseStudy } from "@/lib/caseStudies";
import BrowserFrame from "./BrowserFrame";

interface CaseStudyPanelProps {
  study: CaseStudy;
  priority?: boolean;
}

// A single full-viewport case-study panel in the reference-image layout:
// content left, live-build preview right. Pain-led, not client-led.
export default function CaseStudyPanel({ study, priority = false }: CaseStudyPanelProps) {
  return (
    <div className="flex h-full w-full items-center px-6 pt-24 pb-24 sm:px-10">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c2410c]">
            Case study · {study.industry}
          </span>
          <h2 className="font-serif text-3xl leading-[1.1] tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            {study.headline}
          </h2>
          <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-stone-600">{study.summary}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={`/casestudy/${study.slug}`}
              className="inline-flex items-center gap-2.5 rounded-lg bg-stone-900 px-6 py-3.5 font-bold text-stone-50 shadow-[0_4px_12px_rgba(28,25,23,0.08)] transition-all duration-300 hover:bg-stone-800 hover:shadow-[0_12px_24px_rgba(28,25,23,0.12)] active:scale-[0.98]"
            >
              View case study
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-[#c2410c]"
            >
              View the live site ↗
            </a>
          </div>
        </div>

        <a
          href={study.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the live ${study.liveLabel} site in a new tab`}
          className="group order-first block lg:order-none"
        >
          <BrowserFrame
            src={study.screenshot}
            alt={study.screenshotAlt}
            label={study.liveLabel}
            priority={priority}
            className="cursor-pointer transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_50px_rgba(28,25,23,0.16)]"
          />
        </a>
      </div>
    </div>
  );
}
