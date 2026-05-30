import type { MetadataRoute } from "next";
import { FARMHOUSES } from "@/data/farmhouses";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aljannatfarms.com";

  const farmhousePages: MetadataRoute.Sitemap = FARMHOUSES.map((farm) => ({
    url: `${baseUrl}/${farm.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...farmhousePages,
  ];
}
