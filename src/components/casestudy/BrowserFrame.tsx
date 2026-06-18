import Image from "next/image";

interface BrowserFrameProps {
  src: string;
  alt: string;
  label?: string;
  priority?: boolean;
  className?: string;
}

// A browser-chrome wrapper around a live-build screenshot. The screenshots are
// captured at 1600×1000 (see capture-casestudy-shots.cjs).
export default function BrowserFrame({ src, alt, label, priority = false, className = "" }: BrowserFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_12px_44px_rgba(28,25,23,0.12)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100/80 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
        {label && <span className="ml-2 truncate text-[11px] font-medium text-stone-400">{label}</span>}
      </div>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 620px"
        className="h-auto w-full"
      />
    </div>
  );
}
