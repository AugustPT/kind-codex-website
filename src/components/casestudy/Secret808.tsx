"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

// Hidden easter egg: triple-click the Tlacuaches "808" (three clicks in a row,
// within ~1.5s of each other) to open the unlisted PRYSM iO case study. Looks
// and reads as plain text — no visible hint that it's interactive.
const SLUG = "prysm-io";
const WINDOW_MS = 1500;
const NEEDED = 3;

export default function Secret808({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const count = useRef(0);
  const last = useRef(0);

  const onClick = () => {
    const now = Date.now();
    count.current = now - last.current > WINDOW_MS ? 1 : count.current + 1;
    last.current = now;
    if (count.current >= NEEDED) {
      count.current = 0;
      router.push(`/casestudy/${SLUG}`);
    }
  };

  return (
    <span onClick={onClick} className={`select-none ${className}`}>
      {children}
    </span>
  );
}
