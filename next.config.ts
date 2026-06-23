import type { NextConfig } from "next";

// Mount Codex Mail (a separate Vercel app) under kindcodex.com/mail via Next.js
// Multi-Zones. The child app runs with basePath '/mail' at codex-mail.vercel.app, so
// every /mail and /mail/* request (pages, API routes, and /mail/_next assets) is
// proxied there. Set MAIL_DOMAIN to override the target (e.g. a custom domain).
const MAIL = process.env.MAIL_DOMAIN || "https://codex-mail.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/mail", destination: `${MAIL}/mail` },
      { source: "/mail/:path*", destination: `${MAIL}/mail/:path*` },
    ];
  },
};

export default nextConfig;
