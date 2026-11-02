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
  return profile.photo.fileId ? `/media/${profile.photo.fileId}` : "/souvik.webp";
}

export function resumeUrl(profile: SiteContent["profile"]) {
  return profile.resume.fileId ? `/media/${profile.resume.fileId}` : "/resume/Souvik_Hazra_SDE.pdf";
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
