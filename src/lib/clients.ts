// Per-client config for the delivered "never-miss-a-lead" product. Onboarding a new
// client = append one object to src/data/clients.json (id, who they are, where to
// alert them) and point their website form / Zillow / lead email at
// POST /api/leads/<id>. No code changes per client.

import clients from "@/data/clients.json";

export interface ClientConfig {
  id: string;
  agentName: string;
  brokerage?: string;
  area?: string;
  alertEmail: string; // where the agent gets pinged on every new lead
  replyToEmail?: string; // buyer replies route here (defaults to alertEmail)
  enabled: boolean;
  createdAt?: string;
}

export function listClients(): ClientConfig[] {
  return clients as ClientConfig[];
}

export function getClient(id: string): ClientConfig | null {
  const want = String(id || "").trim().toLowerCase();
  return (clients as ClientConfig[]).find((c) => c.id.toLowerCase() === want) || null;
}
