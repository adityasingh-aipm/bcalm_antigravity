-- Supabase Schema for Bcalm CV Score Application
-- Run this in your Supabase SQL Editor

-- 1) Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  current_status text,
  target_role text,
  years_experience integer,
  onboarding_status text default 'not_started',
  personalization_quality text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update using (auth.uid() = id);

-- 2) CV Submissions table
create table if not exists public.cv_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_file_path text,
  cv_text text not null,
  meta_snapshot jsonb,
  created_at timestamptz not null default now()
);

alter table public.cv_submissions enable row level security;

create policy "cv_submissions_select_own"
on public.cv_submissions for select using (auth.uid() = user_id);

create policy "cv_submissions_insert_own"
on public.cv_submissions for insert with check (auth.uid() = user_id);

-- 3) Analysis Jobs table
create table if not exists public.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.cv_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'processing'
    check (status in ('processing','complete','failed')),
  result_json jsonb,
  error_text text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.analysis_jobs enable row level security;

create policy "analysis_jobs_select_own"
on public.analysis_jobs for select using (auth.uid() = user_id);

create policy "analysis_jobs_insert_own"
on public.analysis_jobs for insert with check (auth.uid() = user_id);

-- Function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    null,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update profiles.updated_at
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();
