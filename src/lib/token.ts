import crypto from "crypto";

// Opaque encrypted token for carrying a known contact (name/email/property) in a
// deep link WITHOUT exposing personal data in the URL. AES-256-GCM, key derived
// from CRON_SECRET. The /capture page decrypts it to prefill the contact step so
// the buyer never retypes what we already have.

function key(): Buffer | null {
  const s = process.env.CRON_SECRET;
  if (!s) return null;
  return crypto.createHash("sha256").update(s).digest();
}

export interface KnownContact {
  n?: string; // name
  e?: string; // email
  p?: string; // property
}

export function encryptContact(obj: KnownContact): string {
  const k = key();
  if (!k) return "";
  try {
    const iv = crypto.randomBytes(12);
    const c = crypto.createCipheriv("aes-256-gcm", k, iv);
    const data = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
    const tag = c.getAuthTag();
    return Buffer.concat([iv, tag, data]).toString("base64url");
  } catch {
    return "";
  }
}

export function decryptContact(token: string): KnownContact | null {
  const k = key();
  if (!k || !token) return null;
  try {
    const buf = Buffer.from(token, "base64url");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const data = buf.subarray(28);
    const d = crypto.createDecipheriv("aes-256-gcm", k, iv);
    d.setAuthTag(tag);
    const out = Buffer.concat([d.update(data), d.final()]).toString("utf8");
    const obj = JSON.parse(out);
    return obj && typeof obj === "object" ? (obj as KnownContact) : null;
  } catch {
    return null;
  }
}
