import type { SiteContent } from "./schema";

export const siteUrl = "https://www.exploresouvik.in";

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export type NavItem = (typeof navItems)[number];

export function photoUrl(profile: SiteContent["profile"]) {
  return profile.photo.url ?? "/souvik.webp";
}

export function resumeUrl(profile: SiteContent["profile"]) {
  return profile.resume.url ?? "/resume/Souvik_Hazra_SDE.pdf";
}

export function isCloudinaryUrl(url: string) {
  try {
    return new URL(url).hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

/** Same-origin prefix proxied to res.cloudinary.com (see rewrites in next.config.ts). */
export const CLOUDINARY_PROXY_PREFIX = "/cdn";

/**
 * Loader for Cloudinary photos, with width/format transforms in the URL.
 * Returns a same-origin `/cdn/...` path that next.config rewrites to Cloudinary, so the
 * browser never talks to res.cloudinary.com directly (no third-party cookies).
 * Versioned delivery URLs stay cacheable across re-uploads of the same public id.
 */
export function cloudinaryImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!isCloudinaryUrl(src)) return src;
  const marker = "/image/upload/";
  const at = src.indexOf(marker);
  if (at === -1) return src;

  const prefix = src.slice(0, at + marker.length);
  const rest = src.slice(at + marker.length);
  const parts = rest.split("/");
  // Drop a prior transform segment (e.g. f_auto,w_400) so we don't stack them.
  const path =
    parts[0] && /[,]|^(?:f_|q_|w_|h_|c_|g_|fl_)/.test(parts[0]) && !/^v\d+$/.test(parts[0])
      ? parts.slice(1).join("/")
      : rest;

  const q = quality ?? 75;
  const cdnUrl = new URL(`${prefix}f_auto,q_${q},c_fill,g_auto,w_${width}/${path}`);
  return `${CLOUDINARY_PROXY_PREFIX}${cdnUrl.pathname}`;
}

/** Absolute URL for JSON-LD / sitemap (Cloudinary links are already absolute). */
export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function yearsSince(isoDate: string) {
  const ms = Date.now() - new Date(isoDate).getTime();
  return Math.max(0, Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000)));
}

/** Splits `**highlight**` markers into plain / highlighted segments. */
export function parseHighlights(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith("**") && part.endsWith("**")
      ? { text: part.slice(2, -2), highlight: true }
      : { text: part, highlight: false },
  );
}
