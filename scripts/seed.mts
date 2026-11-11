// Seeds MongoDB with the built-in default content (only if nothing is published yet).
// Media files are served from /public by default; upload replacements via admin → Cloudinary.
// Also drops any leftover GridFS media.* collections from the previous storage approach.
// Usage: pnpm seed   (reads MONGODB_URI / MONGODB_DB from .env.local)
import { MongoClient } from "mongodb";
import { defaultContent } from "../src/lib/content/defaults";
import { siteContentSchema } from "../src/lib/content/schema";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "portfolio");
  const site = db.collection<{ _id: string; data: unknown; version: number; updatedAt: Date }>("site");

  // Best-effort cleanup of legacy GridFS uploads (now hosted on Cloudinary).
  const dropped = await Promise.allSettled([
    db.dropCollection("media.files"),
    db.dropCollection("media.chunks"),
  ]);
  if (dropped.some((r) => r.status === "fulfilled")) {
    console.log("Dropped legacy GridFS media collections.");
  }

  if (await site.findOne({ _id: "published" })) {
    console.log("Published content already exists — nothing to seed.");
  } else {
    const data = siteContentSchema.parse(defaultContent);
    const now = new Date();
    await site.insertOne({ _id: "published", data, version: 1, updatedAt: now });
    await db.collection("revisions").insertOne({ data, version: 1, publishedAt: now });
    console.log("Seeded published content (v1). Photo/resume use bundled /public defaults until uploaded.");
  }
} finally {
  await client.close();
}
