"use server";

import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireSession } from "@/lib/auth/session";
import {
  getAdminState,
  publishContent,
  readRevision,
  writeDraft,
  type AdminState,
} from "@/lib/content/admin";
import { CONTENT_TAG } from "@/lib/content/get-content";
import { siteContentSchema, type SiteContent } from "@/lib/content/schema";
import { collections, isDbConfigured } from "@/lib/db/mongo";

export type Result<T = null> = { ok: true; data: T } | { ok: false; error: string };

const fail = (error: string): Result<never> => ({ ok: false, error });

function validate(input: unknown): Result<SiteContent> {
  const parsed = siteContentSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  const first = parsed.error.issues[0];
  return fail(`Invalid content at ${first.path.join(".")}: ${first.message}`);
}

// ---------- auth ----------

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export type LoginState = { error: string } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isDbConfigured()) return { error: "Database is not configured (MONGODB_URI)." };
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !process.env.SESSION_SECRET) return { error: "Admin login is not configured." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const { loginAttempts } = await collections();

  const recent = await loginAttempts.countDocuments({ ip, at: { $gt: new Date(Date.now() - WINDOW_MS) } });
  if (recent >= MAX_ATTEMPTS) return { error: "Too many attempts. Try again in 15 minutes." };

  const password = String(formData.get("password") ?? "");
  if (!password || !(await verifyPassword(password, hash))) {
    await loginAttempts.insertOne({ ip, at: new Date() });
    return { error: "Incorrect password." };
  }

  await loginAttempts.deleteMany({ ip });
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- content ----------

export async function saveDraft(input: unknown): Promise<Result<AdminState>> {
  await requireSession();
  const v = validate(input);
  if (!v.ok) return v;
  await writeDraft(v.data);
  return { ok: true, data: await getAdminState() };
}

export async function publish(input: unknown): Promise<Result<AdminState>> {
  await requireSession();
  const v = validate(input);
  if (!v.ok) return v;
  await publishContent(v.data);
  updateTag(CONTENT_TAG);
  return { ok: true, data: await getAdminState() };
}

export async function discardDraft(): Promise<Result<AdminState>> {
  await requireSession();
  const { site } = await collections();
  await site.deleteOne({ _id: "draft" });
  return { ok: true, data: await getAdminState() };
}

/** Loads a past revision into the draft so it can be reviewed before publishing. */
export async function restoreRevision(id: string): Promise<Result<AdminState>> {
  await requireSession();
  const data = await readRevision(id);
  if (!data) return fail("Revision not found.");
  await writeDraft(data);
  return { ok: true, data: await getAdminState() };
}

// ---------- media ----------

const MEDIA_RULES = {
  photo: { types: ["image/webp", "image/png", "image/jpeg", "image/avif"], maxBytes: 2 * 1024 * 1024 },
  resume: { types: ["application/pdf"], maxBytes: 5 * 1024 * 1024 },
} as const;

export async function uploadMedia(formData: FormData): Promise<Result<{ fileId: string; filename: string }>> {
  await requireSession();
  const kind = formData.get("kind");
  const file = formData.get("file");
  if ((kind !== "photo" && kind !== "resume") || !(file instanceof File)) return fail("Invalid upload.");

  const rules = MEDIA_RULES[kind];
  if (!(rules.types as readonly string[]).includes(file.type)) {
    return fail(`Unsupported file type ${file.type || "(unknown)"}.`);
  }
  if (file.size > rules.maxBytes) return fail(`File is larger than ${rules.maxBytes / 1024 / 1024} MB.`);

  const { media } = await collections();
  const filename = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || kind;
  const upload = media.openUploadStream(filename, { metadata: { contentType: file.type, kind } });
  await pipeline(Readable.fromWeb(file.stream() as import("node:stream/web").ReadableStream), upload);

  return { ok: true, data: { fileId: upload.id.toHexString(), filename } };
}
