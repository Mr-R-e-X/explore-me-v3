import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/get-content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { profile, seo } = (await getContent()).content;
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.shortName,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#5b4cf0",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
