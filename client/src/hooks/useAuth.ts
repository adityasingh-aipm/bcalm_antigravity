import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, signOut as supabaseSignOut, syncSessionWithBackend } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  current_status: string | null;
  target_role: string | null;
  years_experience: number | null;
  onboarding_status: string | null;
  personalization_quality: string | null;
}

interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  currentStatus: string | null;
  targetRole: string | null;
  yearsExperience: number | null;
  onboardingStatus: string | null;
  personalizationQuality: string | null;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session) {
        syncSessionWithBackend();
      }
      setSessionChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session) {
        await syncSessionWithBackend();
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      } else {
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const { data: profile, isLoading: profileLoading, error } = useQuery<Profile>({
    queryKey: ["/api/auth/user"],
    enabled: !!supabaseUser && sessionChecked,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const is401 = error?.message?.includes("401") || error?.message?.includes("Unauthorized");

  const user: AuthUser | null = profile && !is401 ? {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    profileImageUrl: profile.avatar_url,
    currentStatus: profile.current_status,
    targetRole: profile.target_role,
    yearsExperience: profile.years_experience,
    onboardingStatus: profile.onboarding_status,
    personalizationQuality: profile.personalization_quality,
  } : null;

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error('Backend logout error:', e);
    }
    await supabaseSignOut();
    queryClient.clear();
  }, [queryClient]);

  return {
    user,
    isLoading: !sessionChecked || (!!supabaseUser && profileLoading && !is401),
    isAuthenticated: !!supabaseUser && !!profile && !is401,
    error: is401 ? null : error,
    logout,
    supabaseUser,
  };
}
