import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kindcodex.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/casestudy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseStudies.map((c) => ({
      url: `${baseUrl}/casestudy/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
