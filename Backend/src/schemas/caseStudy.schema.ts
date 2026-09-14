import { z } from "zod";

export const pressOutletSchema = z.object({
  name: z.string().min(1, "Outlet name is required"),
  url: z.string().url("Outlet URL must be a valid URL"),
});

export const createCaseStudySchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client is required"),
  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .int()
    .gte(2000, "Year must be 2000 or later")
    .lte(2100, "Year must be 2100 or earlier"),
  market: z.string().min(1, "Market is required"),
  category: z.enum(["Gaming", "Sports", "Live", "Culture"], {
    errorMap: () => ({ message: "Category must be one of: Gaming, Sports, Live, Culture" }),
  }),
  shortDesc: z
    .string()
    .min(1, "Short description is required")
    .max(300, "Short description must be 300 characters or fewer"),
  heroImage: z.string().url("Hero image must be a valid URL"),
  bannerImage: z.string().url("Banner image must be a valid URL").optional(),
  fullDesc: z
    .array(z.string().min(1, "Paragraph cannot be empty"))
    .min(1, "At least one paragraph is required"),
  talent: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  gallery: z.array(z.string().url("Each gallery item must be a valid URL")).default([]),
  pressOutlets: z.array(pressOutletSchema).default([]),
  isFeaturedIP: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

// For updates, all fields are optional (PATCH semantics via PUT full-update)
export const updateCaseStudySchema = createCaseStudySchema.partial();

export const reorderCaseStudiesSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.string().uuid("Each id must be a valid UUID"),
        display_order: z.number().int(),
      })
    )
    .min(1, "At least one item required for reorder"),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
export type ReorderCaseStudiesInput = z.infer<typeof reorderCaseStudiesSchema>;
