-- MIGRATION: Enable anonymous CV submissions with proper user tracking
-- Run this in Supabase SQL Editor to enable anonymous CV scoring

-- 1. Add columns to profiles for anonymous user tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS anonymous_session_id text,
ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;

-- Create index for fast anonymous session lookup
CREATE INDEX IF NOT EXISTS idx_profiles_anonymous_session_id 
ON public.profiles(anonymous_session_id) 
WHERE anonymous_session_id IS NOT NULL;

-- 2. Add service role policy for profiles (to create anonymous users)
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
CREATE POLICY "profiles_insert_service" ON public.profiles 
FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_select_service" ON public.profiles;
CREATE POLICY "profiles_select_service" ON public.profiles 
FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;
CREATE POLICY "profiles_update_service" ON public.profiles 
FOR UPDATE TO service_role USING (true);

-- 3. Add policy for anonymous users to view analysis via share links
DROP POLICY IF EXISTS "analysis_jobs_public_select" ON public.analysis_jobs;
CREATE POLICY "analysis_jobs_public_select" ON public.analysis_jobs 
FOR SELECT TO anon USING (true);

-- Verify changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
