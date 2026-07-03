-- Run this once in your Supabase project's SQL Editor (Supabase dashboard -> SQL Editor -> New query).
-- Creates the tables the admin panel reads/writes, seeds one settings row, sets up
-- read-only public access, and creates the public photo storage bucket.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  category text not null,
  title text not null,
  time text not null,
  cost text not null,
  tool text not null,
  icon text not null default 'roll',
  images text[] not null default '{}',
  model_url text,
  role text not null default '',
  status text not null default 'Published',
  tools text[] not null default '{}',
  reviews jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table projects add column if not exists featured boolean not null default false;

-- Upgrade path for projects created before the "images"/"model_url" columns existed
-- (safe to re-run: no-ops once the old columns are gone).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'image_url'
  ) then
    alter table projects add column if not exists images text[] not null default '{}';
    alter table projects add column if not exists model_url text;
    update projects set images = array[image_url]
      where image_url is not null and (images is null or images = '{}');
    alter table projects drop column image_url;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'has3d'
  ) then
    alter table projects drop column has3d;
  end if;
end $$;

create table if not exists settings (
  id integer primary key,
  hero_name text not null default 'YEHIA EL MOHAMADY',
  hero_disc text not null default 'MFG / MOLD DESIGN',
  hero_rev text not null default '2026.01',
  hero_prefix text not null default 'Design work that''s been ',
  hero_emphasis text not null default 'built',
  hero_suffix text not null default ', not just rendered.',
  hero_lede text not null default 'A working register of mold design, reverse engineering, and mechanical projects — each one with the real numbers attached: time spent, cost, and the tools used to get there.',
  stat_hours text not null default '342h',
  stat_rating text not null default '4.9',
  stat_cert_value text not null default 'CSWE',
  stat_cert_label text not null default 'CERTIFIED 06.2025',
  color_bg text not null default '#0B0E11',
  color_panel text not null default '#1A1F26',
  color_panel_hover text not null default '#20262E',
  color_text text not null default '#E8E6E0',
  color_text_dim text not null default '#6B7280',
  color_accent text not null default '#FF6B35',
  color_verified text not null default '#2DD4BF',
  nav_links jsonb not null default '[{"label":"Work","anchor":"work"},{"label":"About","anchor":"about"},{"label":"Reviews","anchor":"reviews"}]'::jsonb,
  nav_cta_label text not null default 'SCHEDULE CALL →',
  nav_cta_anchor text not null default 'contact'
);

-- Upgrade path for settings rows created before nav columns existed.
alter table settings add column if not exists nav_links jsonb not null default '[{"label":"Work","anchor":"work"},{"label":"About","anchor":"about"},{"label":"Reviews","anchor":"reviews"}]'::jsonb;
alter table settings add column if not exists nav_cta_label text not null default 'SCHEDULE CALL →';
alter table settings add column if not exists nav_cta_anchor text not null default 'contact';

-- Logo control: off by default (matches the site's original fixed logo-mark
-- look); turning it on and uploading a file replaces that mark in the nav.
alter table settings add column if not exists logo_url text;
alter table settings add column if not exists logo_enabled boolean not null default false;
alter table settings add column if not exists logo_width integer not null default 28;
alter table settings add column if not exists logo_position text not null default 'before';

-- Hero language/typography control: lets the hero headline be written in
-- Arabic (or any RTL language) with its own direction, alignment, font, and size.
alter table settings add column if not exists hero_direction text not null default 'ltr';
alter table settings add column if not exists hero_text_align text not null default 'left';
alter table settings add column if not exists hero_font_family text not null default 'default';
alter table settings add column if not exists hero_font_size integer not null default 64;

insert into settings (id) values (1)
  on conflict (id) do nothing;

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  anchor text not null default '',
  content jsonb not null default '{}'::jsonb
);

-- Seed the 4 sections the site launches with (hero/projects/contact/footer are
-- fixed types the app always knows how to render; their actual content still
-- comes from the settings/projects tables, not this row's "content" column).
insert into sections (id, type, enabled, sort_order, anchor, content)
values
  ('00000000-0000-0000-0000-000000000001', 'hero', true, 0, 'about', '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'projects', true, 1, 'work', '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000003', 'contact', true, 2, 'contact', '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000004', 'footer', true, 3, '', '{}'::jsonb)
on conflict (id) do nothing;

alter table sections enable row level security;
drop policy if exists "Public read access" on sections;
create policy "Public read access" on sections for select using (true);

-- Seed the 7 projects the site launched with, so editing them in the admin panel
-- persists to real rows instead of the app's hardcoded fallback data.
insert into projects (code, category, title, time, cost, tool, icon, role, status, tools, reviews, sort_order, featured)
values
  ('PRJ-001', 'Plastic Injection', 'Replaceable Insert Seaming Roll', '96h', '$420', 'SW2024', 'roll',
   'Mold Designer', 'Published', array['SolidWorks 2024', 'Mold Tools', 'Moldflow'],
   '[
     {"who": "R. Hassan, Mold Shop Lead", "quote": "Clean parting line strategy and the insert swap logic saved real tooling cost on the second revision."},
     {"who": "A. Farouk, Production Engineer", "quote": "Documentation was thorough enough that manufacturing had zero clarifying questions."}
   ]'::jsonb, 0, true),
  ('PRJ-002', 'Mechanisms', 'Dental Chair Movement Linkage', '52h', '$0', 'SW2023', 'linkage',
   'Mechanism Designer', 'Published', array['SolidWorks 2023', 'Motion Study'],
   '[
     {"who": "M. Adel, R&D Lead", "quote": "Motion range hit spec on the first physical prototype — the linkage geometry was dead on."},
     {"who": "S. Nabil, Test Engineer", "quote": "Load cases were documented clearly enough to validate without re-deriving anything."}
   ]'::jsonb, 1, true),
  ('PRJ-003', 'Advanced Models', '6-Speed Gearbox Assembly', '70h', '$0', 'SW2024', 'gearbox',
   'CAD Engineer', 'Published', array['SolidWorks 2024', 'Toolbox', 'GD&T'],
   '[
     {"who": "K. Osman, Instructor", "quote": "One of the cleanest full assemblies I have reviewed — mates are logical and rebuild fast."},
     {"who": "D. Wael, Peer Reviewer", "quote": "Gear ratios and shaft alignment all check out against the reference spec."}
   ]'::jsonb, 2, true),
  ('PRJ-004', 'Reverse Engineering', 'CNC Spindle Housing Rebuild', '38h', '$180', 'GOM Scan', 'spindle',
   'Reverse Engineer', 'Published', array['GOM Scan', 'SolidWorks', 'Mesh2Surface'],
   '[
     {"who": "T. Ibrahim, Shop Owner", "quote": "Scan-to-CAD deviation stayed under 0.1mm — the rebuilt housing dropped straight in."},
     {"who": "N. Saleh, Machinist", "quote": "Tolerances on the bearing seats were spot on. No rework needed."}
   ]'::jsonb, 3, false),
  ('PRJ-005', 'Sheet Metal', 'Enclosure Bracket Family', '22h', '$60', 'SW2023', 'bracket',
   'Sheet Metal Designer', 'Published', array['SolidWorks Sheet Metal', 'DXF Export'],
   '[
     {"who": "H. Zaki, Fabricator", "quote": "Flat patterns and bend allowances were correct — laser cut and folded with no adjustment."},
     {"who": "L. Amin, Buyer", "quote": "The parametric family made re-sizing for the next SKU a five-minute job."}
   ]'::jsonb, 4, false),
  ('PRJ-006', 'Plastic Injection', 'Monitor Stand Core / Cavity Set', '64h', '$310', 'SW Mold', 'cavity',
   'Mold Designer', 'Published', array['SolidWorks Mold Tools', 'Moldflow', 'DFM Review'],
   '[
     {"who": "F. Gamal, Tooling Lead", "quote": "Draft and shut-off surfaces were handled correctly the first time — rare on a part this size."},
     {"who": "B. Youssef, Molder", "quote": "Cooling layout was thought through; cycle time came in under estimate."}
   ]'::jsonb, 5, false),
  ('PRJ-007', 'Mechanisms', 'Rotary Indexing Fixture', '30h', '$95', 'SW2024', 'fixture',
   'Mechanism Designer', 'Published', array['SolidWorks 2024', 'Motion Study', 'GD&T'],
   '[
     {"who": "W. Kamal, Line Engineer", "quote": "Index repeatability held across a full shift — the detent design was the right call."},
     {"who": "E. Sami, Operator", "quote": "Load and clamp cycle is fast and the part locates the same way every time."}
   ]'::jsonb, 6, false)
on conflict (code) do nothing;

-- Row Level Security: anyone can read (the public site needs this via the anon key),
-- nobody can write except the admin panel, which uses the service role key and
-- therefore bypasses RLS entirely. Do not add insert/update/delete policies here.
alter table projects enable row level security;
alter table settings enable row level security;

drop policy if exists "Public read access" on projects;
create policy "Public read access" on projects for select using (true);

drop policy if exists "Public read access" on settings;
create policy "Public read access" on settings for select using (true);

-- Public storage bucket for uploaded project photos.
insert into storage.buckets (id, name, public)
values ('project-photos', 'project-photos', true)
on conflict (id) do nothing;

-- Project categories: shown as filter chips on the public site and as the
-- category dropdown when editing a project. Admin can add new ones and
-- show/hide existing ones without touching a project's assigned category.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  enabled boolean not null default true,
  sort_order integer not null default 0
);
alter table categories enable row level security;
drop policy if exists "Public read access" on categories;
create policy "Public read access" on categories for select using (true);

insert into categories (name, enabled, sort_order)
values
  ('Plastic Injection', true, 0),
  ('Reverse Engineering', true, 1),
  ('Advanced Models', true, 2),
  ('Mechanisms', true, 3),
  ('Sheet Metal', true, 4)
on conflict (name) do nothing;

-- Leads (contact form submissions) and bookings (confirmed calls) — private
-- business data. No public read/write policies: only the service role
-- (used by /api routes and the admin panel) can touch these tables.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  brief text not null,
  status text not null default 'new',
  slot_display text,
  created_at timestamptz not null default now()
);
alter table leads enable row level security;

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  slot_iso timestamptz not null,
  slot_display text not null,
  created_at timestamptz not null default now()
);
alter table bookings enable row level security;

-- Basic page-view tracking for the admin overview (no personal data, no
-- cookies — just a path and a timestamp per view).
create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  created_at timestamptz not null default now()
);
alter table page_views enable row level security;
create index if not exists page_views_created_at_idx on page_views (created_at);
