import "server-only";
import { GridFSBucket, MongoClient, type Db } from "mongodb";
import type { SiteContent } from "@/lib/content/schema";

export type SiteDoc = {
  _id: "published" | "draft";
  data: SiteContent;
  version: number;
  updatedAt: Date;
};

export type RevisionDoc = {
  data: SiteContent;
  version: number;
  publishedAt: Date;
};

export type LoginAttemptDoc = { ip: string; at: Date };

const globalForMongo = globalThis as unknown as { _mongo?: Promise<Db> };

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

async function connect(): Promise<Db> {
  const client = new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "portfolio");
  await Promise.all([
    db
      .collection<LoginAttemptDoc>("login_attempts")
      .createIndex({ at: 1 }, { expireAfterSeconds: 15 * 60 }),
    db.collection<RevisionDoc>("revisions").createIndex({ publishedAt: -1 }),
  ]);
  return db;
}

// One client per process; reused across hot reloads in dev.
export function getDb(): Promise<Db> {
  if (!isDbConfigured()) throw new Error("MONGODB_URI is not set");
  globalForMongo._mongo ??= connect().catch((err) => {
    globalForMongo._mongo = undefined;
    throw err;
  });
  return globalForMongo._mongo;
}

export async function collections() {
  const db = await getDb();
  return {
    site: db.collection<SiteDoc>("site"),
    revisions: db.collection<RevisionDoc>("revisions"),
    loginAttempts: db.collection<LoginAttemptDoc>("login_attempts"),
    media: new GridFSBucket(db, { bucketName: "media" }),
  };
}
