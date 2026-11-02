import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content/helpers";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-11-02"),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/souvik.webp`],
    },
  ];
}
