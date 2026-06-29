import Qualifier from "@/components/Qualifier";
import DemoCTA from "@/components/DemoCTA";

export const dynamic = "force-dynamic";

// Public interactive demo. When traffic arrives from social/ads with ?ref= (channel)
// and optional ?funnel=, the page shows the live demo (the wow) AND captures the
// viewer as a tracked lead via DemoCTA, tagged by where they came from.
export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; funnel?: string; utm_source?: string; utm_campaign?: string }>;
}) {
  const sp = await searchParams;
  const channel = (sp.ref || sp.utm_source || sp.utm_campaign || "").trim();
  const funnel = (sp.funnel || "").trim();
  const sub =
    funnel === "sort-my-leads"
      ? "A flood of inquiries, sorted and routed the second they land. Watch it work, then get it for your business."
      : "A buyer just inquired. Watch them answer in taps, not paragraphs, while you get a finished, scored lead in seconds.";

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f5", color: "#1c1917", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#c2410c", fontWeight: 700 }}>
          KindCodex · Live demo
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 38, margin: "8px 0 6px", fontWeight: 700 }}>
          Your lead qualifies itself<span style={{ color: "#c2410c" }}>.</span>
        </h1>
        <p style={{ color: "#57534e", fontSize: 17, lineHeight: 1.5, margin: "0 0 28px", maxWidth: 620 }}>
          {sub} Tap through it below.
        </p>
        <Qualifier
          mode="demo"
          agentName="Anne Oliver"
          brokerage="Coldwell Banker"
          buyerName="Jordan"
          property="the Kahala Ave oceanfront listing"
        />
        <DemoCTA ref_={channel} funnel={funnel || "demo"} />
      </div>
    </div>
  );
}
