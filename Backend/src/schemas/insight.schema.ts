import { z } from "zod";

export const createInsightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  outlet: z.string().min(1, "Outlet is required"),
  author: z.string().optional(),
  category: z.enum(["Interview", "Authored Article", "Campaign Coverage"], {
    errorMap: () => ({
      message: "Category must be one of: Interview, Authored Article, Campaign Coverage",
    }),
  }),
  url: z.string().url("URL must be a valid URL"),
  publishDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "publishDate must be in YYYY-MM-DD format")
    .optional(),
  displayOrder: z.number().int().default(0),
});

export const updateInsightSchema = createInsightSchema.partial();

export const reorderInsightsSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.string().uuid("Each id must be a valid UUID"),
        display_order: z.number().int(),
      })
    )
    .min(1, "At least one item required for reorder"),
});

export type CreateInsightInput = z.infer<typeof createInsightSchema>;
export type UpdateInsightInput = z.infer<typeof updateInsightSchema>;
export type ReorderInsightsInput = z.infer<typeof reorderInsightsSchema>;
