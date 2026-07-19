// Server-side store for the LinkedIn posting token + the daily-poster cron state.
//
// The member access token normally lives only in the admin browser (localStorage
// "kc_li"). To let a cron post while August is away, the admin browser syncs it here
// ONCE via /api/content/li-connect. We persist it on a dedicated Brevo "system"
// contact — no new infra, and the token never travels through the chat/transcript.
//
// The token is chunked across several short text attributes so we never hit Brevo's
// per-attribute length ceiling, then reassembled on read.

const BASE = "https://api.brevo.com/v3";
// Non-mailable, never added to any list — pure key/value storage.
const SYSTEM_EMAIL = "linkedin-token@system.kindcodex.com";
const CHUNK = 200;
const MAX_CHUNKS = 12;

function hasBrevo(): boolean {
  return Boolean(process.env.BREVO_API_KEY);
}
function headers() {
  return {
    "api-key": process.env.BREVO_API_KEY as string,
    "Content-Type": "application/json",
    accept: "application/json",
  };
}

// Create a contact attribute if it doesn't already exist (idempotent — a 400
// "already exists" is expected on every call after the first and is ignored).
async function ensureAttr(name: string, type: "text" | "float" = "text"): Promise<void> {
  try {
    await fetch(`${BASE}/contacts/attributes/normal/${encodeURIComponent(name)}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ type }),
    });
  } catch {
    /* ignore */
  }
}

// Partial upsert of the system contact — Brevo merges, so unmentioned attributes
// (e.g. cron state during a token re-sync) are left intact.
async function upsertSystem(attributes: Record<string, string | number>): Promise<boolean> {
  if (!hasBrevo()) return false;
  try {
    const res = await fetch(`${BASE}/contacts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email: SYSTEM_EMAIL, attributes, updateEnabled: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function readSystem(): Promise<Record<string, unknown> | null> {
  if (!hasBrevo()) return null;
  try {
    const res = await fetch(`${BASE}/contacts/${encodeURIComponent(SYSTEM_EMAIL)}`, {
      headers: headers(),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return (d.attributes as Record<string, unknown>) || {};
  } catch {
    return null;
  }
}

// Persist the LinkedIn member token + urn (called once from the admin browser).
export async function saveLiToken(token: string, urn: string): Promise<boolean> {
  if (!hasBrevo()) return false;
  const chunks = (token.match(new RegExp(`.{1,${CHUNK}}`, "g")) || []).slice(0, MAX_CHUNKS);
  if (!chunks.length) return false;
  await ensureAttr("LI_URN");
  await ensureAttr("LI_NCHUNK", "float");
  await ensureAttr("LI_SAVED");
  const attributes: Record<string, string | number> = {
    LI_URN: urn,
    LI_NCHUNK: chunks.length,
    LI_SAVED: new Date().toISOString(),
  };
  for (let i = 0; i < chunks.length; i++) {
    await ensureAttr(`LI_TOK${i}`);
    attributes[`LI_TOK${i}`] = chunks[i];
  }
  return upsertSystem(attributes);
}

// Read back the token + urn for the cron. Returns null if never synced.
export async function loadLiToken(): Promise<{ token: string; urn: string } | null> {
  const a = await readSystem();
  if (!a) return null;
  const n = Number(a.LI_NCHUNK || 0);
  const urn = String(a.LI_URN || "");
  if (!n || !urn) return null;
  let token = "";
  for (let i = 0; i < n; i++) token += String(a[`LI_TOK${i}`] || "");
  if (!token) return null;
  return { token, urn };
}

// When the token was MINTED by LinkedIn (ms epoch), for expiry monitoring.
// Prefers LI_MINTED (set when the mint date is known); falls back to LI_SAVED
// (the sync date — an upper bound that can overestimate remaining life).
export async function loadLiSavedAt(): Promise<number | null> {
  const a = await readSystem();
  const raw = a?.LI_MINTED || a?.LI_SAVED;
  const ts = raw ? Date.parse(String(raw)) : NaN;
  return isNaN(ts) ? null : ts;
}

// --- daily-poster cron state (last posted HST date + next schedule index) ---
export async function loadCronState(): Promise<{ lastPost: string; nextIdx: number }> {
  const a = await readSystem();
  return {
    lastPost: String(a?.LI_LASTPOST || ""),
    nextIdx: Number(a?.LI_NEXTIDX || 0),
  };
}
export async function saveCronState(lastPost: string, nextIdx: number): Promise<boolean> {
  await ensureAttr("LI_LASTPOST");
  await ensureAttr("LI_NEXTIDX", "float");
  return upsertSystem({ LI_LASTPOST: lastPost, LI_NEXTIDX: nextIdx });
}
