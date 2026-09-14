import { Response } from "express";
import { ApiSuccess, ApiError, CaseStudyRow, InsightArticleRow, EnquiryRow } from "../types";

/** Send a successful JSON response */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const body: ApiSuccess<T> = { success: true, data };
  res.status(statusCode).json(body);
}

/** Send an error JSON response */
export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 500
): void {
  const body: ApiError = { success: false, error: { message, code } };
  res.status(statusCode).json(body);
}

/** Map DB row fields from snake_case to camelCase for CaseStudy */
export function mapCaseStudyRow(row: CaseStudyRow): Record<string, unknown> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    year: row.year,
    market: row.market,
    category: row.category,
    shortDesc: row.short_desc,
    heroImage: row.hero_image,
    bannerImage: row.banner_image ?? null,
    fullDesc: row.full_desc,
    talent: row.talent,
    services: row.services,
    gallery: row.gallery,
    pressOutlets: row.press_outlets,
    isFeaturedIP: row.is_featured_ip,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Map DB row fields from snake_case to camelCase for InsightArticle.
 *  Also injects backward-compat `date` alias for the existing frontend. */
export function mapInsightRow(row: InsightArticleRow): Record<string, unknown> {
  return {
    id: row.id,
    title: row.title,
    outlet: row.outlet,
    author: row.author ?? null,
    date: row.author ?? null,
    category: row.category,
    url: row.url,
    publishDate: row.publish_date ?? null,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Map DB row fields from snake_case to camelCase for Enquiry */
export function mapEnquiryRow(row: EnquiryRow): Record<string, unknown> {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? null,
    budget: row.budget ?? null,
    message: row.message,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

/** Map camelCase input to snake_case for CaseStudy DB insert/update */
export function toCaseStudyDBFields(input: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  if (input.title !== undefined) fields.title = input.title;
  if (input.client !== undefined) fields.client = input.client;
  if (input.year !== undefined) fields.year = input.year;
  if (input.market !== undefined) fields.market = input.market;
  if (input.category !== undefined) fields.category = input.category;
  if (input.shortDesc !== undefined) fields.short_desc = input.shortDesc;
  if (input.heroImage !== undefined) fields.hero_image = input.heroImage;
  if (input.bannerImage !== undefined) fields.banner_image = input.bannerImage ?? null;
  if (input.fullDesc !== undefined) fields.full_desc = input.fullDesc;
  if (input.talent !== undefined) fields.talent = input.talent;
  if (input.services !== undefined) fields.services = input.services;
  if (input.gallery !== undefined) fields.gallery = input.gallery;
  if (input.pressOutlets !== undefined) fields.press_outlets = input.pressOutlets;
  if (input.isFeaturedIP !== undefined) fields.is_featured_ip = input.isFeaturedIP;
  if (input.displayOrder !== undefined) fields.display_order = input.displayOrder;
  if (input.slug !== undefined) fields.slug = input.slug;
  return fields;
}

/** Map camelCase input to snake_case for InsightArticle DB insert/update */
export function toInsightDBFields(input: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  if (input.title !== undefined) fields.title = input.title;
  if (input.outlet !== undefined) fields.outlet = input.outlet;
  if (input.author !== undefined) fields.author = input.author;
  if (input.category !== undefined) fields.category = input.category;
  if (input.url !== undefined) fields.url = input.url;
  if (input.publishDate !== undefined) fields.publish_date = input.publishDate;
  if (input.displayOrder !== undefined) fields.display_order = input.displayOrder;
  return fields;
}
