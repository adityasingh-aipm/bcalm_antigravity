import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Loader2, FileSearch, Brain, CheckCircle, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AnalysisJob {
  id: string;
  status: string;
  result_json: any;
  error_text: string | null;
  created_at: string;
  completed_at: string | null;
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
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!jobId) {
      navigate("/upload");
    }
  }, [jobId, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { data: jobData, isLoading } = useQuery<AnalysisJob>({
    queryKey: ["/api/analysis/share", jobId],
    enabled: !!jobId,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "complete" || status === "failed") {
        return false;
      }
      return 2000;
    },
  });

  useEffect(() => {
    if (jobData?.status === "complete") {
      console.log("Job complete, navigating to results:", jobId);
      navigate(`/results/${jobId}`, { replace: true });
    }
  }, [jobData?.status, jobId, navigate]);

  if (jobData?.status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">BCALM</span>
          </div>

          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
          
          <p className="text-white/60 mb-8">
            {jobData.error_text || "Something went wrong while analyzing your CV. Please try again."}
          </p>

          <Button
            onClick={() => navigate("/upload")}
            className="gap-2"
            data-testid="button-retry"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!jobId) {
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
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CurrentIcon className="h-10 w-10 text-primary" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-semibold text-white mb-2"
          >
            {LOADING_STEPS[currentStep].text}
          </motion.p>
        </AnimatePresence>

        <p className="text-white/60 mb-8">
          This usually takes about 30-60 seconds
        </p>

        <div className="flex justify-center gap-2">
          {LOADING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? "bg-primary" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
