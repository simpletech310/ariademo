-- Aria Intake Agent — Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations table
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  program_types text[],
  created_at timestamptz default now()
);

-- Intake forms table
create table if not exists intake_forms (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  organization_name text,
  program_type text,
  sections jsonb not null default '[]',
  status text default 'draft' check (status in ('draft', 'active', 'archived')),
  submission_count integer default 0,
  share_token text unique default encode(gen_random_bytes(12), 'base64'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Form submissions table
create table if not exists form_submissions (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid references intake_forms(id) on delete cascade,
  data jsonb not null default '{}',
  submitted_at timestamptz default now(),
  ip_address text,
  completed boolean default true
);

-- OCR jobs table (track paper form uploads)
create table if not exists ocr_jobs (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid references intake_forms(id),
  original_filename text,
  raw_text text,
  confidence_avg float,
  field_count integer,
  status text default 'done',
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger intake_forms_updated_at
  before update on intake_forms
  for each row execute function update_updated_at();

-- Increment submission count trigger
create or replace function increment_submission_count()
returns trigger as $$
begin
  update intake_forms set submission_count = submission_count + 1 where id = new.form_id;
  return new;
end;
$$ language plpgsql;

create trigger on_submission_insert
  after insert on form_submissions
  for each row execute function increment_submission_count();

-- RLS Policies (public read for now — tighten in production)
alter table intake_forms enable row level security;
create policy "Public read" on intake_forms for select using (true);
create policy "Public insert" on intake_forms for insert with check (true);
create policy "Public update" on intake_forms for update using (true);

alter table form_submissions enable row level security;
create policy "Public insert submissions" on form_submissions for insert with check (true);

-- STORAGE BUCKET CONFIGURATION
-- Note: Run these to set up the 'form-attachments' bucket if not created via dashboard

-- 1. Create the bucket
insert into storage.buckets (id, name, public) 
values ('form-attachments', 'form-attachments', true)
on conflict (id) do nothing;

-- 2. Allow public uploads to 'submissions/' folder
create policy "Allow public uploads"
on storage.objects for insert
with check ( bucket_id = 'form-attachments' );

-- 3. Allow public reading of attachments
create policy "Allow public read"
on storage.objects for select
using ( bucket_id = 'form-attachments' );
