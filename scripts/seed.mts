// Seeds MongoDB with the built-in default content (only if nothing is published yet)
// and uploads the bundled photo and resume into GridFS.
// Usage: pnpm seed   (reads MONGODB_URI / MONGODB_DB from .env.local)
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GridFSBucket, MongoClient } from "mongodb";
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

  if (await site.findOne({ _id: "published" })) {
    console.log("Published content already exists — nothing to do.");
  } else {
    const media = new GridFSBucket(db, { bucketName: "media" });
    const upload = async (file: string, filename: string, contentType: string, kind: string) => {
      const stream = media.openUploadStream(filename, { metadata: { contentType, kind } });
      stream.end(await readFile(join(process.cwd(), "public", file)));
      await new Promise((resolve, reject) => stream.on("finish", resolve).on("error", reject));
      return stream.id.toHexString();
    };

    const data = siteContentSchema.parse({
      ...defaultContent,
      profile: {
        ...defaultContent.profile,
        photo: { ...defaultContent.profile.photo, fileId: await upload("souvik.webp", "souvik.webp", "image/webp", "photo") },
        resume: {
          ...defaultContent.profile.resume,
          fileId: await upload("resume/Souvik_Hazra_SDE.pdf", defaultContent.profile.resume.filename, "application/pdf", "resume"),
        },
      },
    });

    const now = new Date();
    await site.insertOne({ _id: "published", data, version: 1, updatedAt: now });
    await db.collection("revisions").insertOne({ data, version: 1, publishedAt: now });
    console.log("Seeded published content (v1) with photo and resume.");
  }
} finally {
  await client.close();
}
