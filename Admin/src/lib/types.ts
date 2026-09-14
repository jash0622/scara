// ── Mirrors backend types exactly ────────────────────────────────────────────

export interface PressOutlet {
  name: string;
  url: string;
}

export interface CaseStudy {
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

export interface InsightArticle {
  id: string;
  title: string;
  outlet: string;
  author: string | null;
  date: string | null; // backward-compat alias for author
  category: "Interview" | "Authored Article" | "Campaign Coverage";
  url: string;
  publishDate: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "archived";
  submittedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Form input types ──────────────────────────────────────────────────────────

export type CaseStudyFormData = {
  title: string;
  client: string;
  year: number;
  market: string;
  category: "Gaming" | "Sports" | "Live" | "Culture";
  shortDesc: string;
  heroImage: string;
  bannerImage?: string | null;
  fullDesc: string[];
  services: string[];
  gallery: string[];
  pressOutlets: PressOutlet[];
  isFeaturedIP: boolean;
  displayOrder?: number;
};

export type InsightFormData = {
  title: string;
  outlet: string;
  author?: string;
  category: "Interview" | "Authored Article" | "Campaign Coverage";
  url: string;
  publishDate?: string;
  displayOrder?: number;
};

// ── API response wrapper ──────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: { message: string; code: string; details?: Record<string, string> };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Enquiry filter params ─────────────────────────────────────────────────────

export interface EnquiryFilters {
  page?: number;
  limit?: number;
  status?: "new" | "read" | "archived";
  budget?: string;
  from?: string;
  to?: string;
}
