import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration - anon key is public and safe to include in client code
const SUPABASE_URL = 'https://rhwvwvvwjwvtlxzqooii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3Z3dnZ3and2dGx4enFvb2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODQzOTEsImV4cCI6MjA3ODE2MDM5MX0.tvv9lDe_4PACmq4s1j1jkwAPiTEYATjLZUaDtW_e4Ms';

// Use environment variables if available (for flexibility), otherwise use hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = true;

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
  
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
    return null;
  }
  return session;
}

export async function syncSessionWithBackend() {
  const session = await getSession();
  if (!session) return null;
  
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Session sync error:', error);
    return null;
  }
}
