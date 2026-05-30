import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/portal-x7q9m",
        "/portal-x7q9m/",
        "/api/",
        "/_next/",
      ],
    },
    sitemap: "https://aljannatfarms.com/sitemap.xml",
  };
}
