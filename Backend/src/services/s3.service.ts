import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../config/s3";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const PRESIGN_EXPIRES_IN = 15 * 60; // 15 minutes — generous to handle clock skew

/** Sanitize a filename to be safe as an S3 object key segment */
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "")
    .slice(0, 100); // cap length
}

/**
 * Generate a presigned PUT URL for direct browser-to-S3 upload.
 * Returns { uploadUrl, publicUrl, key }.
 * The file bytes never pass through our Express server.
 */
export async function generatePresignedUploadUrl(params: {
  fileName: string;
  contentType: string;
  folder: "case-studies" | "case-studies/cards" | "case-studies/banners" | "case-studies/gallery" | "insights" | "general";
}): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const sanitized = sanitizeFileName(params.fileName);
  const key = `${params.folder}/${uuidv4()}-${sanitized}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    // Note: ContentType is NOT included in the presigned signature.
    // The browser sets it directly on the XHR PUT request.
    // Including it here causes 403 if the header value differs by even a byte.
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGN_EXPIRES_IN,
  });

  const publicUrl = `${env.AWS_S3_PUBLIC_BASE_URL}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Delete an object from S3 by its full public URL.
 * Extracts the object key from the URL.
 * Best-effort — logs failures but does NOT throw (callers should not
 * block their main operation on S3 cleanup failures).
 */
export async function deleteS3Object(publicUrl: string): Promise<void> {
  try {
    // Extract key by stripping the base URL prefix
    const base = env.AWS_S3_PUBLIC_BASE_URL.replace(/\/$/, "");
    if (!publicUrl.startsWith(base)) {
      logger.warn({ publicUrl }, "deleteS3Object: URL does not match configured S3 base, skipping");
      return;
    }
    const key = publicUrl.slice(base.length + 1); // +1 for the "/"

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    logger.info({ key }, "S3 object deleted");
  } catch (err) {
    // Best-effort — log and continue
    logger.error({ err, publicUrl }, "deleteS3Object failed (best-effort, continuing)");
  }
}

/**
 * Delete multiple S3 objects. Runs in parallel, best-effort.
 * Used when deleting a case study to clean up hero + gallery images.
 */
export async function deleteS3Objects(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.map((url) => deleteS3Object(url)));
}

/**
 * Generate a short-lived presigned GET URL for a private S3 object.
 * Not used in current flow (all uploads are to public-read prefix) —
 * included for completeness if a private-asset use case arises.
 */
export async function generatePresignedGetUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}
