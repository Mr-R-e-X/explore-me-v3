import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db/mongo";
import { defaultContent } from "./defaults";
import { siteContentSchema, type SiteContent } from "./schema";

export const MAX_REVISIONS = 50;

export type RevisionSummary = { id: string; version: number; publishedAt: string };

export type AdminState = {
  content: SiteContent;
  hasDraft: boolean;
  publishedVersion: number;
  publishedAt: string | null;
  draftSavedAt: string | null;
  revisions: RevisionSummary[];
};

export async function getAdminState(): Promise<AdminState> {
  const { site, revisions } = await collections();
  const [published, draft, recent] = await Promise.all([
    site.findOne({ _id: "published" }),
    site.findOne({ _id: "draft" }),
    revisions
      .find({}, { projection: { data: 0 } })
      .sort({ publishedAt: -1 })
      .limit(MAX_REVISIONS)
      .toArray(),
  ]);

  const source = draft ?? published;
  const parsed = source ? siteContentSchema.safeParse(source.data) : null;

  return {
    content: parsed?.success ? parsed.data : defaultContent,
    hasDraft: Boolean(draft),
    publishedVersion: published?.version ?? 0,
    publishedAt: published?.updatedAt.toISOString() ?? null,
    draftSavedAt: draft?.updatedAt.toISOString() ?? null,
    revisions: recent.map((r) => ({
      id: r._id.toHexString(),
      version: r.version,
      publishedAt: r.publishedAt.toISOString(),
    })),
  };
}

export async function writeDraft(data: SiteContent) {
  const { site } = await collections();
  const published = await site.findOne({ _id: "published" }, { projection: { version: 1 } });
  await site.replaceOne(
    { _id: "draft" },
    { data, version: published?.version ?? 0, updatedAt: new Date() },
    { upsert: true },
  );
}

/** Publishes `data`, records a revision and clears the draft. Returns the new version. */
export async function publishContent(data: SiteContent) {
  const { site, revisions } = await collections();
  const published = await site.findOne({ _id: "published" }, { projection: { version: 1 } });
  const version = (published?.version ?? 0) + 1;
  const now = new Date();

  await site.replaceOne({ _id: "published" }, { data, version, updatedAt: now }, { upsert: true });
  await revisions.insertOne({ data, version, publishedAt: now });
  await site.deleteOne({ _id: "draft" });

  const stale = await revisions
    .find({}, { projection: { _id: 1 } })
    .sort({ publishedAt: -1 })
    .skip(MAX_REVISIONS)
    .toArray();
  if (stale.length) await revisions.deleteMany({ _id: { $in: stale.map((r) => r._id) } });

  return version;
}

export async function readRevision(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const { revisions } = await collections();
  const rev = await revisions.findOne({ _id: new ObjectId(id) });
  const parsed = rev ? siteContentSchema.safeParse(rev.data) : null;
  return parsed?.success ? parsed.data : null;
}

/** Removes a history snapshot. Refuses to delete the revision that matches the live published version. */
export async function deleteRevision(id: string): Promise<"ok" | "not_found" | "live"> {
  if (!ObjectId.isValid(id)) return "not_found";
  const { site, revisions } = await collections();
  const _id = new ObjectId(id);
  const rev = await revisions.findOne({ _id }, { projection: { version: 1 } });
  if (!rev) return "not_found";

  const published = await site.findOne({ _id: "published" }, { projection: { version: 1 } });
  if (published && rev.version === published.version) return "live";

  const result = await revisions.deleteOne({ _id });
  return result.deletedCount ? "ok" : "not_found";
}
