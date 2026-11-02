import { z } from "zod";

const text = (max = 400) => z.string().trim().max(max);
const required = (max = 400) => text(max).min(1, "Required");
const url = z.union([z.literal(""), z.url("Must be a full URL (https://…)")]);
const list = (max = 60) => z.array(required(600)).max(max);

export const figureKeys = ["agents", "pc", "none"] as const;

export const linkSchema = z.object({
  id: required(60),
  label: required(60),
  href: z.url("Must be a full URL (https://…)"),
});

export const jobSchema = z.object({
  id: required(60),
  company: required(80),
  url,
  role: required(120),
  period: required(60),
  note: text(160),
  points: list(12),
  stack: list(20),
});

export const projectSchema = z.object({
  id: required(60),
  title: required(80),
  kicker: required(120),
  badge: text(120),
  summary: required(600),
  points: list(10),
  stack: list(20),
  figure: z.enum(figureKeys),
  links: z.array(linkSchema).max(4),
});

export const workProjectSchema = z.object({
  id: required(60),
  title: required(80),
  kicker: required(120),
  summary: required(600),
  stack: list(12),
  href: url,
});

export const skillGroupSchema = z.object({
  id: required(60),
  label: required(40),
  items: list(30),
});

export const mediaRefSchema = z.object({
  fileId: z.string().regex(/^[a-f0-9]{24}$/).nullable(),
});

export const siteContentSchema = z.object({
  seo: z.object({
    title: required(120),
    description: required(300),
    keywords: list(30),
  }),
  profile: z.object({
    name: required(80),
    shortName: required(40),
    role: required(80),
    headline: required(120),
    pitch: required(400),
    location: required(120),
    careerStart: z.iso.date("Use YYYY-MM-DD"),
    email: z.email(),
    social: z.object({ github: url, linkedin: url, x: url }),
    education: z.object({ degree: text(120), school: text(160), year: text(10) }),
    photo: mediaRefSchema.extend({ alt: required(160) }),
    resume: mediaRefSchema.extend({ filename: required(120) }),
  }),
  sections: z.object({
    about: required(60),
    experience: required(60),
    projects: required(60),
    workProjects: required(80),
    skills: required(60),
  }),
  about: z.object({
    paragraphs: z.array(required(1200)).min(1).max(8),
    recentTitle: required(120),
    recentTech: list(16),
  }),
  experience: z.array(jobSchema).max(20),
  projects: z.array(projectSchema).max(12),
  workProjects: z.array(workProjectSchema).max(12),
  skills: z.array(skillGroupSchema).max(12),
  contact: z.object({
    kicker: required(60),
    title: required(120),
    body: required(600),
  }),
  footer: z.object({ text: required(200) }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Project = z.infer<typeof projectSchema>;
export type WorkProject = z.infer<typeof workProjectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type FigureKey = (typeof figureKeys)[number];
