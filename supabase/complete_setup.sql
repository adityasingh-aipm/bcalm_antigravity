-- COMPLETE SUPABASE SETUP FOR BCALM CV SCORE APPLICATION
-- Run this ENTIRE file in your Supabase SQL Editor
-- This will create all required tables, columns, and policies

-- ============================================
-- 1. PROFILES TABLE - Full setup
-- ============================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add all required columns (IF NOT EXISTS prevents errors if already present)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS current_status text,
ADD COLUMN IF NOT EXISTS target_role text,
ADD COLUMN IF NOT EXISTS years_experience integer,
ADD COLUMN IF NOT EXISTS onboarding_status text DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS personalization_quality text,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_service" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;

-- User policies (for client-side access)
CREATE POLICY "profiles_select_own" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- Service role policies (for backend access with service_role key)
CREATE POLICY "profiles_insert_service" ON public.profiles 
FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "profiles_select_service" ON public.profiles 
FOR SELECT TO service_role USING (true);

CREATE POLICY "profiles_update_service" ON public.profiles 
FOR UPDATE TO service_role USING (true);


-- ============================================
-- 2. CV SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.cv_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_file_path text,
  cv_text text NOT NULL,
  meta_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cv_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cv_submissions_select_own" ON public.cv_submissions;
DROP POLICY IF EXISTS "cv_submissions_insert_own" ON public.cv_submissions;
DROP POLICY IF EXISTS "cv_submissions_insert_service" ON public.cv_submissions;
DROP POLICY IF EXISTS "cv_submissions_select_service" ON public.cv_submissions;

CREATE POLICY "cv_submissions_select_own" ON public.cv_submissions 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cv_submissions_insert_own" ON public.cv_submissions 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cv_submissions_insert_service" ON public.cv_submissions 
FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "cv_submissions_select_service" ON public.cv_submissions 
FOR SELECT TO service_role USING (true);


-- ============================================
-- 3. ANALYSIS JOBS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.analysis_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.cv_submissions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing','complete','failed')),
  result_json jsonb,
  error_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analysis_jobs_select_own" ON public.analysis_jobs;
DROP POLICY IF EXISTS "analysis_jobs_insert_own" ON public.analysis_jobs;
DROP POLICY IF EXISTS "analysis_jobs_insert_service" ON public.analysis_jobs;
DROP POLICY IF EXISTS "analysis_jobs_select_service" ON public.analysis_jobs;
DROP POLICY IF EXISTS "analysis_jobs_update_service" ON public.analysis_jobs;

CREATE POLICY "analysis_jobs_select_own" ON public.analysis_jobs 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "analysis_jobs_insert_own" ON public.analysis_jobs 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "analysis_jobs_insert_service" ON public.analysis_jobs 
FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "analysis_jobs_select_service" ON public.analysis_jobs 
FOR SELECT TO service_role USING (true);

CREATE POLICY "analysis_jobs_update_service" ON public.analysis_jobs 
FOR UPDATE TO service_role USING (true);


-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profiles.updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();


-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Check profiles table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';
