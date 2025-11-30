import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("resources_token"));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("resources_token");
    const storedUser = localStorage.getItem("resources_user");
    
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("resources_token");
    localStorage.removeItem("resources_user");
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => {
    const storedUser = localStorage.getItem("resources_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    const storedToken = localStorage.getItem("resources_token");
    setToken(storedToken);
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    logout,
    refreshUser,
  };
}
