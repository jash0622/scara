import { Request } from "express";

// ── Database row types (snake_case — mirrors Supabase/Postgres columns) ───────

export interface CaseStudyRow {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  market: string;
  category: "Gaming" | "Sports" | "Live" | "Culture";
  short_desc: string;
  hero_image: string;
  banner_image: string | null;
  full_desc: string[];
  talent: string[];
  services: string[];
  gallery: string[];
  press_outlets: PressOutlet[];
  is_featured_ip: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface InsightArticleRow {
  id: string;
  title: string;
  outlet: string;
  author: string | null;
  category: "Interview" | "Authored Article" | "Campaign Coverage";
  url: string;
  publish_date: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "archived";
  submitted_at: string;
}

export interface AdminUserRow {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

// ── Shared sub-types ──────────────────────────────────────────────────────────

export interface PressOutlet {
  name: string;
  url: string;
}

// ── API response shapes (camelCase — sent to clients) ────────────────────────

export interface CaseStudyDTO {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  market: string;
  category: "Gaming" | "Sports" | "Live" | "Culture";
  shortDesc: string;
  heroImage: string;
  bannerImage: string | null;
  fullDesc: string[];
  talent: string[];
  services: string[];
  gallery: string[];
  pressOutlets: PressOutlet[];
  isFeaturedIP: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface InsightArticleDTO {
  id: string;
  title: string;
  outlet: string;
  author: string | null;
  /** Backward-compat alias for `author` — the old frontend reads `article.date` */
  date: string | null;
  category: "Interview" | "Authored Article" | "Campaign Coverage";
  url: string;
  publishDate: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryDTO {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "archived";
  submittedAt: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AdminPayload {
  username: string;
  sub: string; // admin user id
}

// ── Express request augmentation ──────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  admin: AdminPayload;
}

// ── API standard response ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
