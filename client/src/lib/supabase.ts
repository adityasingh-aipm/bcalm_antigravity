import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createNoOpClient = () => ({
  from: () => ({ 
    insert: async () => ({ error: new Error('Supabase not configured') }),
    select: async () => ({ error: new Error('Supabase not configured'), data: null }),
    upsert: async () => ({ error: new Error('Supabase not configured') }),
  }),
  auth: {
    signInWithOtp: async () => ({ error: new Error('Supabase not configured'), data: null }),
    verifyOtp: async () => ({ error: new Error('Supabase not configured'), data: { user: null, session: null } }),
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
} as unknown as SupabaseClient);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not available - auth and analytics will be disabled');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createNoOpClient();
