import type { Metadata } from "next";
import CaseStudyDeck from "@/components/casestudy/CaseStudyDeck";
import { visibleCaseStudies } from "@/lib/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies | KindCodex",
  description:
    "See how we fixed websites that customers couldn't find, didn't trust, or left without calling — for local businesses across very different industries. Real problems, real builds, real fixes.",
};

export default function CaseStudyPage() {
  return <CaseStudyDeck studies={visibleCaseStudies} />;
}
