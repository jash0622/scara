import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const uploadPresignSchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  contentType: z
    .string()
    .min(1, "contentType is required")
    .refine(
      (ct) => ct.startsWith("image/"),
      "Only image content types are allowed (image/jpeg, image/png, image/webp, etc.)"
    ),
  folder: z
    .enum([
      "case-studies",
      "case-studies/cards",
      "case-studies/banners",
      "case-studies/gallery",
      "insights",
      "general",
    ])
    .default("general"),
});

export const deleteUploadSchema = z.object({
  url: z.string().url("url must be a valid URL"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UploadPresignInput = z.infer<typeof uploadPresignSchema>;
export type DeleteUploadInput = z.infer<typeof deleteUploadSchema>;
