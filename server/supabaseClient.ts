import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabaseAdmin: SupabaseClient;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else if (supabaseUrl && supabaseAnonKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not found, using anon key (limited functionality)');
  supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.error('Missing Supabase environment variables - auth will not work');
  supabaseAdmin = null as any;
}

export { supabaseAdmin };

export const createSupabaseClient = (accessToken?: string) => {
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not configured');
  }
  
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  
  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    }
  });
};
