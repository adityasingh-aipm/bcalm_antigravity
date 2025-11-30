import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("resources_token"));
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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
  }, []);

  const logout = () => {
    localStorage.removeItem("resources_token");
    localStorage.removeItem("resources_user");
    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    logout,
  };
}
