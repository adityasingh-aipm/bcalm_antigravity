import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { syncSessionWithBackend } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function AuthCallbackPage() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const result = await syncSessionWithBackend();
        
        if (!result) {
          setError("Failed to authenticate. Please try again.");
          return;
        }

        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        await queryClient.invalidateQueries({ queryKey: ["/api/me"] });

        navigate("/start");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication failed. Please try again.");
      }
    }

    const timer = setTimeout(handleCallback, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033] px-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-white/60">Signing you in...</p>
    </div>
  );
}
