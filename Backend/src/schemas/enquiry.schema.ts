import { z } from "zod";

export const createEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  company: z.string().optional(),
  budget: z
    .enum(["< $50k", "$50k - $100k", "$100k - $250k", "$250k+"])
    .default("$50k - $100k"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"], {
    errorMap: () => ({ message: "Status must be one of: new, read, archived" }),
  }),
});

export const enquiryListQuerySchema = z.object({
  page: z.string().default("1").transform(Number),
  limit: z.string().default("20").transform(Number),
  // Comma-separated list of statuses, e.g. "new,read". Empty/undefined = all.
  status: z.string().optional(),
  budget: z.string().optional(),
  q: z.string().optional(), // free-text search across name/email/company
  from: z.string().optional(), // ISO date string
  to: z.string().optional(),   // ISO date string
});

export const enquiryStatsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export const bulkStatusSchema = z.object({
  ids: z.array(z.string().uuid("Invalid enquiry id")).min(1, "Select at least one enquiry"),
  status: z.enum(["new", "read", "archived"], {
    errorMap: () => ({ message: "Status must be one of: new, read, archived" }),
  }),
});

export const replyEnquirySchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message too long"),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type EnquiryStatusInput = z.infer<typeof enquiryStatusSchema>;
export type EnquiryListQuery = z.infer<typeof enquiryListQuerySchema>;
export type EnquiryStatsQuery = z.infer<typeof enquiryStatsQuerySchema>;
export type BulkStatusInput = z.infer<typeof bulkStatusSchema>;
export type ReplyEnquiryInput = z.infer<typeof replyEnquirySchema>;
