import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_FOLDER_NAME,
  );
}

function ensureConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured (CLOUDINARY_* env vars).");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type CloudinaryUpload = {
  url: string;
  publicId: string;
};

/** Uploads a photo (image) or resume (raw PDF) into the configured Cloudinary folder. */
export async function uploadToCloudinary(opts: {
  kind: "photo" | "resume";
  buffer: Buffer;
}): Promise<CloudinaryUpload> {
  ensureConfigured();

  const folder = process.env.CLOUDINARY_FOLDER_NAME!;
  const resourceType = opts.kind === "photo" ? "image" : "raw";
  // Stable ids so re-uploads replace the previous asset instead of accumulating.
  // Include .pdf on raw public_ids so Cloudinary serves the correct content type.
  const publicId = opts.kind === "photo" ? "profile-photo" : "resume.pdf";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
        ...(opts.kind === "photo" ? { format: "webp", quality: "auto:good" } : {}),
      },
      (err, result) => {
        if (err || !result?.secure_url) {
          reject(err ?? new Error("Cloudinary upload returned no URL."));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(opts.buffer);
  });
}
