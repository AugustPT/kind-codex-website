"use client";

import { motion } from "framer-motion";
import type { CaseStudy, Section } from "@/lib/caseStudies";
import CaseStudyHeader from "./CaseStudyHeader";
import BrowserFrame from "./BrowserFrame";
import ClarityCTA from "./ClarityCTA";

const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-5 inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-[#c2410c]">
      {children}
    </span>
  );
}

function SectionBlock({ section }: { section: Section }) {
  switch (section.kind) {
    case "prose":
      return (
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <div className="space-y-4">
            {section.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-stone-600">
                {p}
              </p>
            ))}
          </div>
          {section.pullQuote && (
            <blockquote className="mt-8 border-l-[3px] border-[#c2410c] pl-5 font-serif text-2xl leading-snug text-stone-900 sm:text-3xl">
              {section.pullQuote}
            </blockquote>
          )}
        </Reveal>
      );

    case "cards":
      return (
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          {section.intro && <p className="mb-8 text-lg leading-relaxed text-stone-600">{section.intro}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.title} className="rounded-xl border border-stone-200 bg-white p-5">
                <h3 className="font-bold tracking-tight text-stone-900">{item.title}</h3>
                {item.desc && <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{item.desc}</p>}
              </div>
            ))}
          </div>
        </Reveal>
      );

    case "list":
      return (
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          {section.intro && <p className="mb-6 text-lg leading-relaxed text-stone-600">{section.intro}</p>}
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-base leading-relaxed text-stone-600">
                <span className="mt-px font-bold text-[#c2410c]">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      );

    case "steps":
      return (
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          {section.intro && <p className="mb-6 text-lg leading-relaxed text-stone-600">{section.intro}</p>}
          <ol className="space-y-4">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[#c2410c]/30 bg-[#c2410c]/5 font-mono text-xs font-bold text-[#c2410c]">
                  {i + 1}
                </span>
                <span className="text-base font-semibold text-stone-700">{item}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      );

    case "quote":
      return (
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <blockquote className="font-serif text-2xl leading-snug text-stone-900 sm:text-3xl md:text-4xl">
            {section.quote}
          </blockquote>
        </Reveal>
      );
  }
}

export default function CaseStudyDetail({ study }: { study: CaseStudy }) {
  const { detail } = study;
  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900">
      <CaseStudyHeader />

      <main className="px-6 pb-24 pt-14">
        {/* Hero */}
        <Reveal className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-[#c2410c]">
            Case study · {study.industry}
          </span>
          <div className="mb-5 flex flex-wrap gap-2">
            {detail.metaChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold text-stone-500"
              >
                {chip}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-stone-900 sm:text-5xl">
            {detail.title}
          </h1>
          <p className="mt-4 text-sm font-semibold text-stone-500">{detail.client}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">{study.summary}</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {detail.liveLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-[#c2410c]"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <BrowserFrame src={detail.heroImage} alt={detail.heroAlt} label={hostOf(detail.liveLinks[0].url)} priority />
        </Reveal>

        {/* Sections */}
        <div className="mt-20 space-y-20">
          {detail.sections.map((section, i) => (
            <SectionBlock key={i} section={section} />
          ))}
        </div>

        {/* Closing CTA */}
        <div className="mx-auto mt-24 max-w-2xl border-t border-stone-200 pt-20">
          <ClarityCTA heading="Want this kind of path for your business?" />
        </div>
      </main>
    </div>
  );
}
