-- =====================================================
-- MIGRATION: Enable anonymous CV submissions
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- 1. Allow NULL user_id in cv_submissions for anonymous users
ALTER TABLE public.cv_submissions ALTER COLUMN user_id DROP NOT NULL;

-- 2. Allow NULL user_id in analysis_jobs for anonymous users  
ALTER TABLE public.analysis_jobs ALTER COLUMN user_id DROP NOT NULL;

-- 3. Update cv_submissions policies for service role
DROP POLICY IF EXISTS "cv_submissions_insert_service" ON public.cv_submissions;
CREATE POLICY "cv_submissions_insert_service" ON public.cv_submissions 
FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "cv_submissions_select_service" ON public.cv_submissions;
CREATE POLICY "cv_submissions_select_service" ON public.cv_submissions 
FOR SELECT TO service_role USING (true);

-- 4. Update analysis_jobs policies for service role
DROP POLICY IF EXISTS "analysis_jobs_insert_service" ON public.analysis_jobs;
CREATE POLICY "analysis_jobs_insert_service" ON public.analysis_jobs 
FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "analysis_jobs_select_service" ON public.analysis_jobs;
CREATE POLICY "analysis_jobs_select_service" ON public.analysis_jobs 
FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "analysis_jobs_update_service" ON public.analysis_jobs;
CREATE POLICY "analysis_jobs_update_service" ON public.analysis_jobs 
FOR UPDATE TO service_role USING (true);

-- Verify the changes worked
SELECT 
  table_name, 
  column_name, 
  is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('cv_submissions', 'analysis_jobs') 
  AND column_name = 'user_id';
