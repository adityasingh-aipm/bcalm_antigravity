import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, GraduationCap, BarChart3, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trackPageView } from "@/lib/analytics";
import { AuthModal } from "@/components/AuthModal";

export default function AssessmentLandingPage() {
  const { user, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    trackPageView();
  }, []);

  const handleStart = () => {
    if (user) {
      setLocation("/ai-pm-readiness/start");
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    refreshUser();
    setLocation("/ai-pm-readiness/start");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-4" style={{ color: "#111111" }}>
            AI PM Readiness Check
          </h1>
          <p className="text-lg md:text-xl mb-2" style={{ color: "#4a5568" }}>
            Are you ready for AI Product roles? Find your strengths, gaps, and a clear learning path.
          </p>
          <p className="text-sm md:text-base" style={{ color: "#9ca3af" }}>
            Designed for 3rd–4th year students and recent graduates · 24 questions · 10 minutes · instant personalized report
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <Button
            size="lg"
            className="text-base px-8"
            onClick={handleStart}
            data-testid="button-start-readiness"
          >
            Start My Readiness Check
          </Button>
          
          {!user && (
            <p className="mt-4 text-sm" style={{ color: "#9ca3af" }}>
              Already have an account?{" "}
              <button
                onClick={() => setShowAuthDialog(true)}
                className="text-primary hover:underline"
                data-testid="link-login"
              >
                Log in →
              </button>
            </p>
          )}
        </motion.div>

        <AuthModal
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={handleAuthSuccess}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <BarChart3 className="mx-auto mb-3" style={{ width: "32px", height: "32px", color: "#6c47ff" }} />
            <p className="text-sm" style={{ color: "#111111" }}>
              See where you stand across 8 AI PM skills
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <GraduationCap className="mx-auto mb-3" style={{ width: "32px", height: "32px", color: "#6c47ff" }} />
            <p className="text-sm" style={{ color: "#111111" }}>
              Get a personalized gap report + learning recommendations
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <BookOpen className="mx-auto mb-3" style={{ width: "32px", height: "32px", color: "#6c47ff" }} />
            <p className="text-sm" style={{ color: "#111111" }}>
              Understand how top students move from 'curious' to 'role-ready'
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            You'll need a free Bcalm account so we can save your report and email it to you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
