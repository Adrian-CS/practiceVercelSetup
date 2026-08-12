-- Seed data for local/preview environments.
-- Applied automatically by `supabase db reset`, or run manually with:
--   supabase db execute -f supabase/seed.sql
-- Safe to re-run: truncates first so ids restart from 1 each time.

truncate table "public"."documents" restart identity cascade;
truncate table "public"."assignees" restart identity cascade;

insert into "public"."assignees" ("name", "email") values
  ('Alice Johnson',  'alice.johnson@example.com'),
  ('Kenji Watanabe', 'kenji.watanabe@example.com'),
  ('Laura Chen',     'laura.chen@example.com'),
  ('Marcus Reid',    'marcus.reid@example.com');

insert into "public"."documents" ("title", "client", "due_date", "status", "assignee_id") values
  ('Annual service contract',    'Acme Corp',        '2026-07-30', 'completed',   1),
  ('Software license renewal',  'Nordic Imports',    '2026-08-05', 'completed',   2),
  ('Q3 sales proposal',          'Sakura Trading',    '2026-08-10', 'in_progress', 1),
  ('Internal audit report',      'Global Logistics',  '2026-08-14', 'in_progress', 3),
  ('Data policy update',         'Acme Corp',         '2026-08-18', 'pending',     4),
  ('Invoice pending review',     'Nordic Imports',    '2026-08-20', 'pending',     2),
  ('Non-disclosure agreement',   'Sakura Trading',    '2026-08-25', 'pending',     NULL),
  ('Contingency plan',           'Global Logistics',  '2026-09-01', 'pending',     3);
