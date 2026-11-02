import { Readable } from "node:stream";
import { ObjectId } from "mongodb";
import { collections, isDbConfigured } from "@/lib/db/mongo";

// Uploaded files are immutable (a re-upload gets a new id), so they can be cached forever.
export async function GET(_req: Request, ctx: RouteContext<"/media/[id]">) {
  const { id } = await ctx.params;
  if (!isDbConfigured() || !ObjectId.isValid(id)) return new Response("Not found", { status: 404 });

  const { media } = await collections();
  const _id = new ObjectId(id);
  const file = await media.find({ _id }).next();
  if (!file) return new Response("Not found", { status: 404 });

  const contentType = (file.metadata?.contentType as string | undefined) ?? "application/octet-stream";
  const stream = Readable.toWeb(media.openDownloadStream(_id)) as ReadableStream;

  return new Response(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(file.length),
      "Content-Disposition": `inline; filename="${file.filename.replace(/"/g, "")}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
