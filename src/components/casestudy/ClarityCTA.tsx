import Link from "next/link";

// Premium-restraint CTA: one dominant value-first action, the call demoted to a
// quiet link. No de-risking badges. Shared by the closing deck panel and the
// bottom of every detail page.
export default function ClarityCTA({ heading }: { heading?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      {heading && (
        <h2 className="mb-8 max-w-md font-serif text-3xl leading-tight tracking-tight text-stone-900 sm:text-4xl">
          {heading}
        </h2>
      )}
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 rounded-lg bg-[#c2410c] px-8 py-4 font-bold text-stone-50 shadow-[0_4px_16px_rgba(194,65,12,0.18)] transition-all duration-300 hover:bg-[#9a3412] active:scale-[0.98]"
      >
        Start the Clarity Path
        <span aria-hidden="true">→</span>
      </Link>
      <p className="mt-4 text-sm font-medium text-stone-500">See what your business is missing.</p>
      <a
        href="https://calendly.com/august-kindcodex"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 text-sm font-medium text-stone-400 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-700"
      >
        Or book a 15-minute call
      </a>
    </div>
  );
}
