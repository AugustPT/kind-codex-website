import type { Metadata } from "next";
import AuditExperience from "@/components/AuditExperience";
import { sortMyLeads } from "@/lib/outcomes";

export const metadata: Metadata = {
  title: "Sort My Leads | KindCodex",
  description:
    "Real estate agents: take the 60-second audit and see how a sorted, auto-qualified pipeline could move faster.",
};

export default function SortMyLeadsPage() {
  return <AuditExperience config={sortMyLeads} />;
}
