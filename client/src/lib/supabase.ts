import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a no-op client if environment variables are missing
const createNoOpClient = () => ({
  from: () => ({ 
    insert: async () => ({ error: new Error('Supabase not configured') }),
    select: async () => ({ error: new Error('Supabase not configured'), data: null })
  })
} as any);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not available - analytics will be disabled');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createNoOpClient();
