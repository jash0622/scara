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
  status: z.enum(["new", "read", "archived"]).optional(),
  budget: z.string().optional(),
  from: z.string().optional(), // ISO date string
  to: z.string().optional(),   // ISO date string
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type EnquiryStatusInput = z.infer<typeof enquiryStatusSchema>;
export type EnquiryListQuery = z.infer<typeof enquiryListQuerySchema>;
