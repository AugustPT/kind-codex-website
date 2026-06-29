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

      // Client deliverables, routed automatically by naming convention — no per-client
      // edits to this file. Deploy each app to the matching Vercel project name and the
      // clean URL just works:
      //   kindcodex.com/live/<slug>   -> https://live-<slug>.vercel.app   (the working app)
      //   kindcodex.com/offer/<slug>  -> https://offer-<slug>.vercel.app  (the firm-price offer)
      // Keep client apps self-contained (single-file) or relative-path so they render
      // correctly when proxied under the subpath.
      { source: "/live/:slug", destination: "https://live-:slug.vercel.app" },
      { source: "/live/:slug/:path*", destination: "https://live-:slug.vercel.app/:path*" },
      { source: "/offer/:slug", destination: "https://offer-:slug.vercel.app" },
      { source: "/offer/:slug/:path*", destination: "https://offer-:slug.vercel.app/:path*" },
    ];
  },
};

export default nextConfig;
