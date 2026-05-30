import type { MetadataRoute } from "next";
import { readAvailableFarmhouses } from "@/lib/farmhouse-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aljannatfarms.com";
  const farmhouses = await readAvailableFarmhouses();

  const farmhousePages: MetadataRoute.Sitemap = farmhouses.map((farm) => ({
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
