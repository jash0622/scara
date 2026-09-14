-- ============================================================================
-- SCARA Backend — Initial Schema Migration
-- Run against your Supabase project via:
--   supabase db push  (if using Supabase CLI)
--   or paste into Supabase Dashboard → SQL Editor
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================================
-- CASE STUDIES
-- ============================================================================
create table if not exists case_studies (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  client           text not null,
  year             integer not null,
  market           text not null,
  category         text not null check (category in ('Gaming','Sports','Live','Culture')),
  short_desc       text not null,
  hero_image       text not null,
  full_desc        text[] not null default '{}',
  talent           text[] not null default '{}',
  services         text[] not null default '{}',
  gallery          text[] not null default '{}',
  -- press_outlets stores an array of { "name": "...", "url": "..." } objects
  press_outlets    jsonb not null default '[]',
  is_featured_ip   boolean not null default false,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_case_studies_order
  on case_studies (display_order asc);

create index if not exists idx_case_studies_category
  on case_studies (category);

create index if not exists idx_case_studies_year
  on case_studies (year desc);

-- ============================================================================
-- INSIGHT ARTICLES (Press / Interviews)
-- ============================================================================
create table if not exists insight_articles (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  outlet           text not null,
  -- "author" is the correctly-named column. The legacy frontend reads `date`
  -- which was misused to store an author name. The API response layer maps
  -- author → also emits a `date` alias for backward compatibility.
  author           text,
  category         text not null check (
                     category in ('Interview','Authored Article','Campaign Coverage')
                   ),
  url              text not null,
  publish_date     date,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_insights_order
  on insight_articles (display_order asc);

-- ============================================================================
-- CONTACT ENQUIRIES
-- ============================================================================
create table if not exists enquiries (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  company          text,
  budget           text check (
                     budget in ('< $50k','$50k - $100k','$100k - $250k','$250k+')
                   ),
  message          text not null,
  status           text not null default 'new'
                     check (status in ('new','read','archived')),
  submitted_at     timestamptz not null default now()
);

create index if not exists idx_enquiries_status
  on enquiries (status);

create index if not exists idx_enquiries_submitted_at
  on enquiries (submitted_at desc);

create index if not exists idx_enquiries_email
  on enquiries (email);

-- ============================================================================
-- ADMIN USERS (single internal account — no public signup)
-- ============================================================================
create table if not exists admin_users (
  id               uuid primary key default gen_random_uuid(),
  username         text unique not null,
  password_hash    text not null,
  created_at       timestamptz not null default now()
);

-- ============================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to tables with updated_at
drop trigger if exists trg_case_studies_updated_at on case_studies;
create trigger trg_case_studies_updated_at
  before update on case_studies
  for each row execute function set_updated_at();

drop trigger if exists trg_insight_articles_updated_at on insight_articles;
create trigger trg_insight_articles_updated_at
  before update on insight_articles
  for each row execute function set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- The backend always connects with the service_role key which bypasses RLS.
-- These policies are defense-in-depth — they protect against any hypothetical
-- accidental exposure of the anon/public key.
-- ============================================================================
alter table case_studies    enable row level security;
alter table insight_articles enable row level security;
alter table enquiries        enable row level security;
alter table admin_users      enable row level security;

-- Public can SELECT case studies and insight articles (read-only website content)
drop policy if exists "public read case_studies" on case_studies;
create policy "public read case_studies"
  on case_studies for select using (true);

drop policy if exists "public read insight_articles" on insight_articles;
create policy "public read insight_articles"
  on insight_articles for select using (true);

-- No public access at all to enquiries or admin_users
-- (service_role key bypasses RLS and handles all writes server-side)
