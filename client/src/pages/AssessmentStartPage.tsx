import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AssessmentStartPage() {
  const { token, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: resumeData } = useQuery<{ hasIncomplete: boolean; attempt?: any; answeredCount?: number }>({
    queryKey: ["/api/assessment/resume"],
    enabled: isAuthenticated,
  });

  const clearIncompleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/assessment/attempts/incomplete", {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment/resume"] });
      setLocation("/ai-pm-readiness/questions");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/resources?redirect=/ai-pm-readiness/start");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const handleBegin = () => {
    setLocation("/ai-pm-readiness/questions");
  };

  const handleResume = () => {
    setLocation("/ai-pm-readiness/questions");
  };

  const handleStartFresh = () => {
    clearIncompleteMutation.mutate();
  };

  if (resumeData?.hasIncomplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: "#111111" }}>
              Resume Your Assessment?
            </h1>
            <p className="text-lg mb-8" style={{ color: "#4a5568" }}>
              You have an incomplete assessment with {resumeData.answeredCount} questions answered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleResume}
                data-testid="button-resume-assessment"
              >
                Resume Assessment
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleStartFresh}
                disabled={clearIncompleteMutation.isPending}
                data-testid="button-start-fresh"
              >
                {clearIncompleteMutation.isPending ? "Clearing..." : "Start Fresh"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: "#111111" }}>
            You're about to start your AI PM Readiness Check
          </h1>
          <p className="text-lg mb-6" style={{ color: "#4a5568" }}>
            24 questions · 8 skill areas · ~10 minutes
          </p>
          <p className="text-base mb-8" style={{ color: "#9ca3af" }}>
            Answer honestly. This is for you, not a test. Your responses stay private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleBegin}
              data-testid="button-begin-assessment"
            >
              Begin Assessment
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/ai-pm-readiness")}
              data-testid="button-cancel"
            >
              I'll do this later
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
