// Trust-first logo wall for the cover panel. Real client wordmarks are rendered
// as text marks; the remaining slots are neutral placeholders until real logo
// assets are dropped in. Kept uniform + desaturated for an agency-grade feel.
const REAL = [
  { name: "AREA", sub: "Associated Real Estate Advisors" },
  { name: "Eaton Square", sub: "Waikīkī" },
];

const PLACEHOLDERS = 4;

export default function LogoWall() {
  return (
    <div className="w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {REAL.map((logo) => (
          <div
            key={logo.name}
            className="flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-5 text-center"
          >
            <span className="font-serif text-base font-bold tracking-tight text-stone-500">{logo.name}</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">{logo.sub}</span>
          </div>
        ))}
        {Array.from({ length: PLACEHOLDERS }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-stone-200 bg-white/40 px-4 py-5"
          >
            <span className="h-4 w-4 rounded-sm bg-stone-200" />
            <span className="h-2 w-12 rounded-full bg-stone-200" />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] font-medium text-stone-400">
        More client logos coming as the deck grows.
      </p>
    </div>
  );
}
