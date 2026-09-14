import { Request, Response, NextFunction } from "express";
import { generatePresignedUploadUrl, deleteS3Object } from "../services/s3.service";
import { sendSuccess } from "../utils/apiResponse";
import { UploadPresignInput, DeleteUploadInput } from "../schemas/auth.schema";

// POST /api/upload/presign  (admin)
// Returns a presigned S3 PUT URL + the final public URL.
// File bytes go browser → S3 directly — never through this server.
export async function presign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileName, contentType, folder } = req.body as UploadPresignInput;

    const result = await generatePresignedUploadUrl({ fileName, contentType, folder });

    sendSuccess(res, {
      uploadUrl: result.uploadUrl,   // presigned PUT URL — valid for 5 minutes
      publicUrl: result.publicUrl,   // permanent CDN URL to store in DB after upload succeeds
      key: result.key,               // S3 object key — optional, useful for admin panel tracking
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/upload  (admin)
// Explicitly delete an S3 object by its public URL.
// Used when an admin removes an image before saving the parent record.
export async function deleteUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url } = req.body as DeleteUploadInput;
    await deleteS3Object(url);
    sendSuccess(res, { deleted: true, url });
  } catch (err) {
    next(err);
  }
}
