import Image from "next/image";

// Trust-first logo wall. AREA ships a real wordmark logo; Eaton Square's brand
// is a text wordmark on its own site, so we render it the same way. Kept
// uniform + desaturated for an agency-grade "trusted by" feel. New studies add
// a card here (real logo asset, or a text wordmark).
export default function LogoWall() {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
        Recent client builds
      </span>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex h-20 w-56 items-center justify-center rounded-xl border border-stone-200 bg-white px-8">
          <Image
            src="/casestudies/logos/area.png"
            alt="Associated Real Estate Advisors"
            width={324}
            height={41}
            className="h-6 w-auto opacity-70 grayscale"
          />
        </div>
        <div className="flex h-20 w-56 items-center justify-center rounded-xl border border-stone-200 bg-white px-8">
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-500">Eaton Square</span>
        </div>
        <div className="flex h-20 w-56 items-center justify-center rounded-xl border border-stone-200 bg-white px-8 text-center">
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-500">IREM Hawaii</span>
        </div>
        <div className="flex h-20 w-56 items-center justify-center rounded-xl border border-stone-200 bg-white px-8 text-center">
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-500">Tlacuaches 808</span>
        </div>
        <div className="flex h-20 w-56 flex-col items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-center">
          <span className="font-serif text-xl font-bold leading-none tracking-tight text-stone-500">Aloha</span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-stone-400">Property Managers</span>
        </div>
      </div>
    </div>
  );
}
