import QRCode from "qrcode";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send to a funnel | KindCodex",
  robots: "noindex",
};

const BASE = "https://kindcodex.com";

const FUNNELS = [
  {
    slug: "never-miss-a-lead",
    title: "Never Miss a Lead",
    use: "For agents losing leads / slow follow-up",
    accent: "#c2410c",
  },
  {
    slug: "sort-my-leads",
    title: "Sort My Leads",
    use: "For agents drowning in unsorted leads",
    accent: "#1c1917",
  },
];

export default async function GoPage() {
  const cards = await Promise.all(
    FUNNELS.map(async (f) => ({
      ...f,
      url: `${BASE}/${f.slug}`,
      qr: await QRCode.toString(`${BASE}/${f.slug}`, {
        type: "svg",
        margin: 1,
        width: 240,
        color: { dark: "#1c1917", light: "#ffffff" },
      }),
    }))
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf9f5",
        color: "#1c1917",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        padding: "28px 18px 48px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
          KindCodex<span style={{ color: "#c2410c" }}>.</span>
        </div>
        <p style={{ color: "#8a8a93", fontSize: 13, margin: "0 0 24px" }}>
          Have them scan the right one, or tap to open it for them.
        </p>

        {cards.map((c) => (
          <div
            key={c.slug}
            style={{
              background: "#fff",
              border: "1px solid #e7e5e4",
              borderRadius: 18,
              padding: "22px 18px 18px",
              marginBottom: 20,
              boxShadow: "0 4px 20px rgba(28,25,23,0.04)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: c.accent }}>{c.title}</div>
            <div style={{ fontSize: 13, color: "#8a8a93", margin: "4px 0 16px" }}>{c.use}</div>

            <div
              style={{ width: 220, height: 220, margin: "0 auto" }}
              // QR code SVG
              dangerouslySetInnerHTML={{ __html: c.qr }}
            />

            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                marginTop: 16,
                padding: "13px",
                background: c.accent,
                color: "#fff",
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Tap to open →
            </a>
            <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 8 }}>
              kindcodex.com/{c.slug}
            </div>
          </div>
        ))}

        <p style={{ color: "#a8a29e", fontSize: 11, marginTop: 8 }}>
          Tip: screenshot a QR to keep on your phone for instant showing.
        </p>
      </div>
    </div>
  );
}
