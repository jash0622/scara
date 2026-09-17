-- ============================================================================
-- SCARA Admin — feature migration (run once in the Supabase SQL editor)
-- Adds: role-based access (admin_users.role) + audit log (audit_log table).
--
-- Safe to run on an existing database. Everything is additive and the app is
-- backward-compatible before this runs (login defaults role to 'admin', and
-- audit writes are best-effort so a missing table never breaks an action).
-- ============================================================================

-- 1) Role-based access ─────────────────────────────────────────────────────
--    Existing single admin keeps full access via the DEFAULT 'admin'.
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin';

-- Constrain to the two supported roles.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_role_check'
  ) THEN
    ALTER TABLE admin_users
      ADD CONSTRAINT admin_users_role_check CHECK (role IN ('admin', 'editor'));
  END IF;
END $$;

-- 2) Audit log ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor      text NOT NULL,          -- admin username at time of action
  actor_id   uuid,                   -- admin_users.id (nullable for safety)
  action     text NOT NULL,          -- e.g. 'enquiry.status_change'
  entity     text NOT NULL,          -- e.g. 'enquiry', 'admin'
  entity_id  text,                   -- affected row id (nullable for bulk)
  meta       jsonb,                  -- arbitrary context (status, name, etc.)
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Feed is always ordered newest-first.
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx
  ON audit_log (created_at DESC);

-- ── Optional: promote/demote an account ──────────────────────────────────────
-- UPDATE admin_users SET role = 'editor' WHERE username = 'some-editor';
-- UPDATE admin_users SET role = 'admin'  WHERE username = 'scara-admin';
