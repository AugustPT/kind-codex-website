import { getClient } from "@/lib/clients";
import { decryptContact } from "@/lib/token";
import Qualifier from "@/components/Qualifier";

export const dynamic = "force-dynamic";

// Public, per-client capture page (the buyer experience). A delivered client shares
// /capture/<id> or embeds it; every buyer taps through the qualifier and the agent
// gets a scored lead via /api/leads/<id>.
export default async function CapturePage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ q0?: string; t?: string; n?: string; p?: string }>;
}) {
  const { clientId } = await params;
  const sp = await searchParams;
  const client = getClient(clientId);
  // Decrypt the known contact (if the link came from a qualifier email) — no PII in the URL.
  const known = decryptContact(sp.t || "");

  if (!client || !client.enabled) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf9f5", color: "#1c1917", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#8a8a93" }}>This inquiry page isn&apos;t available.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f5", color: "#1c1917", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 20px 80px" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, margin: "0 0 6px", fontWeight: 700 }}>
          Inquire with {client.agentName}<span style={{ color: "#c2410c" }}>.</span>
        </h1>
        <p style={{ color: "#57534e", fontSize: 16, margin: "0 0 26px", maxWidth: 600 }}>
          {client.area ? `${client.area}` : "Real estate"}{client.brokerage ? ` · ${client.brokerage}` : ""}. A few quick taps and
          you&apos;ll get a real answer within minutes, day or night.
        </p>
        <Qualifier
          mode="capture"
          clientId={client.id}
          agentName={client.agentName}
          brokerage={client.brokerage || ""}
          area={client.area || ""}
          seedAnswer={sp.q0 || ""}
          buyerName={known?.n || sp.n || ""}
          property={known?.p || sp.p || ""}
          knownName={known?.n || ""}
          knownEmail={known?.e || ""}
        />
      </div>
    </div>
  );
}
