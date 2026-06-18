import Link from "next/link";

// Minimal editorial header for detail pages.
export default function CaseStudyHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200 bg-[#faf9f5]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-stone-900">
          KindCodex<span className="text-[#c2410c]">.</span>
        </Link>
        <Link
          href="/casestudy"
          className="text-[10px] font-bold uppercase tracking-wider text-stone-400 transition-colors hover:text-stone-700"
        >
          ← All case studies
        </Link>
      </div>
    </header>
  );
}
