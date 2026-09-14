// ── Frontend shared types ─────────────────────────────────────────────────────
// Single source of truth for types used across components.
// No mock data here — all data comes from the API via src/lib/api.ts

export interface PressOutlet {
  name: string;
  url: string;
}

/**
 * CaseStudy — the shape used throughout the frontend UI.
 * heroImage  = card thumbnail (work grid / card stack)
 * bannerImage = wide modal banner (falls back to heroImage if not set)
 */
export interface PressOutlet {
  name: string;
  url: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  market: string;
  category: 'Gaming' | 'Sports' | 'Live' | 'Culture';
  shortDesc: string;
  fullDesc: string[];
  heroImage: string;
  bannerImage?: string;
  talent: string[];
  services: string[];
  gallery: string[];
  pressOutlets: PressOutlet[]; // name + url
  isFeaturedIP?: boolean;
}
