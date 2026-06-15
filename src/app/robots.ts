import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/email",
        "/email-sequence",
      ],
    },
    sitemap: "https://kindcodex.com/sitemap.xml",
  };
}
