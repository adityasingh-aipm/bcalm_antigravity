import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Loader2, FileSearch, Brain, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisJob {
  id: string;
  status: string;
  score: number | null;
  strengths: string[] | null;
  gaps: string[] | null;
  quickWins: string[] | null;
  notes: string | null;
  needsJd: boolean;
  needsTargetRole: boolean;
  createdAt: string;
  completedAt: string | null;
}

const LOADING_STEPS = [
  { icon: FileSearch, text: "Reading your CV..." },
  { icon: Brain, text: "Analyzing content..." },
  { icon: Sparkles, text: "Generating insights..." },
  { icon: CheckCircle, text: "Almost done..." },
];

export default function ProcessingPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const jobId = searchParams.get("jobId");
  
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
      return;
    }
    if (!jobId) {
      navigate("/upload");
    }
  }, [authLoading, isAuthenticated, jobId, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { data: jobData, isLoading } = useQuery<AnalysisJob>({
    queryKey: ["/api/analysis", jobId],
    enabled: !!jobId && isAuthenticated,
    refetchInterval: (query) => {
      if (query.state.data?.status === "complete") {
        return false;
      }
      return 2000;
    },
  });

  useEffect(() => {
    if (jobData?.status === "complete") {
      navigate(`/results/${jobId}`);
    }
  }, [jobData, jobId, navigate]);

  if (authLoading || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const CurrentIcon = LOADING_STEPS[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">BCALM</span>
        </div>

        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentIcon className="h-12 w-12 text-primary" />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h2
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-bold text-white mb-4"
            data-testid="text-loading-step"
          >
            {LOADING_STEPS[currentStep].text}
          </motion.h2>
        </AnimatePresence>

        <p className="text-white/60 mb-8">
          Our AI is carefully reviewing your CV to provide personalized feedback
        </p>

        <div className="flex justify-center gap-2">
          {LOADING_STEPS.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? "bg-primary" : "bg-white/20"
              }`}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
              }}
            />
          ))}
        </div>

        <p className="text-white/40 text-sm mt-8">
          This usually takes 10-30 seconds
        </p>
      </div>
    </div>
  );
}
