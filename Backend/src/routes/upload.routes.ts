import { Router } from "express";
import { presign, deleteUpload } from "../controllers/upload.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { uploadPresignSchema, deleteUploadSchema } from "../schemas/auth.schema";

const router = Router();

// All upload routes are admin-only — no public upload access

// POST /api/upload/presign
// Returns { uploadUrl, publicUrl, key } for direct browser→S3 upload
router.post("/presign", requireAuth, validate(uploadPresignSchema), presign);

// DELETE /api/upload
// Deletes an S3 object by its public URL
router.delete("/", requireAuth, validate(deleteUploadSchema), deleteUpload);

export default router;
