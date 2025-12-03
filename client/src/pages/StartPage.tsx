import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface MeResponse {
  user: { id: string };
  profile: {
    onboarding_status: string | null;
  };
}

export default function StartPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: meData, isLoading: meLoading } = useQuery<MeResponse>({
    queryKey: ["/api/me"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
      return;
    }

    if (meData) {
      if (meData.profile?.onboarding_status !== "complete") {
        navigate("/onboarding");
      } else {
        navigate("/upload");
      }
    }
  }, [authLoading, isAuthenticated, meData, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-white/60">Loading your profile...</p>
    </div>
  );
}
