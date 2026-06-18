import type { Metadata } from "next";
import CaseStudyDeck from "@/components/casestudy/CaseStudyDeck";
import { visibleCaseStudies } from "@/lib/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies | KindCodex",
  description:
    "Real builds for real businesses — systems built from first principles to solve a specific problem, not just pretty websites.",
};

export default function CaseStudyPage() {
  return <CaseStudyDeck studies={visibleCaseStudies} />;
}
