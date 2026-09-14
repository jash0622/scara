'use client';

// ── API base URL ──────────────────────────────────────────────────────────────
// In development: http://localhost:4000
// In production: set NEXT_PUBLIC_API_BASE_URL to your deployed backend URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// ── Types (mirrors backend DTOs) ─────────────────────────────────────────────

export interface PressOutletDTO {
  name: string;
  url: string;
}

export interface CaseStudyDTO {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  market: string;
  category: 'Gaming' | 'Sports' | 'Live' | 'Culture';
  shortDesc: string;
  heroImage: string;
  bannerImage: string | null;
  fullDesc: string[];
  talent: string[];
  services: string[];
  gallery: string[];
  pressOutlets: PressOutletDTO[];
  isFeaturedIP: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiSuccess<T> { success: true; data: T }
interface ApiError { success: false; error: { message: string; code: string } }
type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // 60-second Next.js revalidation cache
    next: { revalidate: 60 },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

// ── Case Studies ──────────────────────────────────────────────────────────────

export async function fetchCaseStudies(): Promise<CaseStudyDTO[]> {
  return apiFetch<CaseStudyDTO[]>('/api/case-studies');
}

export async function fetchCaseStudy(idOrSlug: string): Promise<CaseStudyDTO> {
  return apiFetch<CaseStudyDTO>(`/api/case-studies/${idOrSlug}`);
}

// ── Insights ──────────────────────────────────────────────────────────────────

export interface InsightArticleDTO {
  id: string;
  title: string;
  outlet: string;
  author: string | null;
  date: string | null;       // backward-compat alias for author
  category: 'Interview' | 'Authored Article' | 'Campaign Coverage';
  url: string;
  publishDate: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchInsights(): Promise<InsightArticleDTO[]> {
  return apiFetch<InsightArticleDTO[]>('/api/insights');
}

// ── Enquiries (contact form) ──────────────────────────────────────────────────

export interface EnquiryPayload {
  name: string;
  email: string;
  company?: string;
  budget: '< $50k' | '$50k - $100k' | '$100k - $250k' | '$250k+';
  message: string;
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message ?? 'Failed to submit enquiry');
  }

  return json.data as { id: string };
}
