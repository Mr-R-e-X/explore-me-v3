import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { collections, isDbConfigured } from "@/lib/db/mongo";
import { defaultContent } from "./defaults";
import { yearsSince } from "./helpers";
import { siteContentSchema, type SiteContent } from "./schema";

export const CONTENT_TAG = "content";

export type LoadedContent = {
  content: SiteContent;
  isDraft: boolean;
  /** Whole years since profile.careerStart, computed inside the cache scope. */
  years: number;
};

/**
 * Site content for public pages. Cached until a publish calls
 * `updateTag(CONTENT_TAG)`; in draft mode the cache is bypassed and the
 * draft document is returned instead.
 */
export async function getContent(): Promise<LoadedContent> {
  "use cache";
  cacheTag(CONTENT_TAG);

  const { isEnabled: isDraft } = await draftMode();

  if (!isDbConfigured()) {
    cacheLife("max");
    return withYears(defaultContent, false);
  }

  try {
    const { site } = await collections();
    const doc =
      (isDraft && (await site.findOne({ _id: "draft" }))) || (await site.findOne({ _id: "published" }));
    const parsed = doc ? siteContentSchema.safeParse(doc.data) : null;
    if (doc && !parsed?.success) console.error("[content] stored content failed validation", parsed?.error);

    cacheLife("max");
    return withYears(parsed?.success ? parsed.data : defaultContent, isDraft && doc?._id === "draft");
  } catch (err) {
    // Don't pin a fallback for a month because of a transient outage.
    console.error("[content] failed to load from MongoDB, using defaults", err);
    cacheLife("hours");
    return withYears(defaultContent, false);
  }
}

function withYears(content: SiteContent, isDraft: boolean): LoadedContent {
  return { content, isDraft, years: yearsSince(content.profile.careerStart) };
}
