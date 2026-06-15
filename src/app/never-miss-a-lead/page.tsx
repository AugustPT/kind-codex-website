import type { Metadata } from "next";
import AuditExperience from "@/components/AuditExperience";
import { neverMissALead } from "@/lib/outcomes";

export const metadata: Metadata = {
  title: "Never Miss a Lead | KindCodex",
  description:
    "Real estate agents: take the 60-second Lead Leak Audit and see how many leads — and commissions — are slipping through the cracks.",
};

export default function NeverMissALeadPage() {
  return <AuditExperience config={neverMissALead} />;
}
