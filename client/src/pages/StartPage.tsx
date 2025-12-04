import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function StartPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const onboardingData = localStorage.getItem("cv_onboarding");
    
    if (onboardingData) {
      try {
        const data = JSON.parse(onboardingData);
        if (data.status === "complete") {
          navigate("/upload");
          return;
        }
      } catch (e) {
        // Invalid data, start fresh
      }
    }
    
    navigate("/onboarding");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-white/60">Setting things up...</p>
    </div>
  );
}
