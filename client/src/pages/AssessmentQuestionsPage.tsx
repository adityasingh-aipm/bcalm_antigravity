import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackEvent, getUtmParams, getPagePath } from "@/lib/analytics";
import { ChevronLeft } from "lucide-react";
import type { AssessmentQuestion } from "@shared/schema";

const ANSWER_OPTIONS = [
  { value: 1, label: "Not yet, this is new to me" },
  { value: 2, label: "I've heard of this but can't really use it" },
  { value: 3, label: "I understand basics but need guidance to apply it" },
  { value: 4, label: "I can apply this in projects with some help" },
  { value: 5, label: "I can do this confidently and explain it to others" },
];

export default function AssessmentQuestionsPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const assessmentCompletedRef = useRef(false);
  
  // Refs to track latest state for cleanup function
  const attemptIdRef = useRef<string | null>(null);
  const answersRef = useRef<Record<string, number>>({});
  const currentQuestionIndexRef = useRef(0);
  const questionsRef = useRef<AssessmentQuestion[] | null>(null);
  const hasTrackedDropRef = useRef(false); // Prevent duplicate tracking

  console.log("✅ AssessmentQuestionsPage mounted");

  const { data: questions, isLoading: loadingQuestions } = useQuery<AssessmentQuestion[]>({
    queryKey: ["/api/assessment/questions"],
    enabled: isAuthenticated,
  });

  // Fetch resume data to check if resuming incomplete attempt
  const { data: resumeData } = useQuery<{ hasIncomplete: boolean; attempt?: any; answeredCount?: number }>({
    queryKey: ["/api/assessment/resume"],
    enabled: isAuthenticated,
  });

  const createAttemptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/assessment/attempts", {});
      return await response.json();
    },
    onSuccess: (data: any) => {
      setAttemptId(data.id);
      
      // If resuming, restore answers and current question index
      if (data.answers && Object.keys(data.answers).length > 0) {
        const restoredAnswers: Record<string, number> = {};
        for (const ans of data.answers) {
          restoredAnswers[ans.questionId] = ans.answerValue;
        }
        setAnswers(restoredAnswers);
        // Synchronously update answers ref
        answersRef.current = restoredAnswers;
        
        // Set current index to the next unanswered question, or last if all answered
        if (questions) {
          const nextIndex = questions.findIndex(q => !restoredAnswers[q.id]);
          const finalIndex = nextIndex === -1 ? questions.length - 1 : nextIndex;
          setCurrentQuestionIndex(finalIndex);
          // Synchronously update index ref
          currentQuestionIndexRef.current = finalIndex;
        }
      }
      
      const utmParams = getUtmParams();
      const pagePath = getPagePath();
      trackEvent("assessment_started", { 
        pagePath: pagePath, 
        utm: utmParams 
      });
    },
  });

  const saveAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answerValue }: { questionId: string; answerValue: number }) => {
      return await apiRequest("POST", `/api/assessment/answers/${attemptId}`, {
        questionId,
        answerValue,
      });
    },
  });

  const completeAssessmentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/assessment/complete/${attemptId}`, {});
      return await response.json();
    },
    onSuccess: (data: any) => {
      assessmentCompletedRef.current = true;
      
      const getScoreBand = (score: number) => {
        if (score >= 96) return "96-120";
        if (score >= 72) return "72-95";
        if (score >= 48) return "48-71";
        return "0-47";
      };
      
      const pagePath = getPagePath();
      
      trackEvent("assessment_completed", {
        score: data.totalScore,
        readinessBand: data.readinessBand,
        scoreBand: getScoreBand(data.totalScore),
        pagePath: pagePath
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assessment/resume"] });
      setLocation(`/ai-pm-readiness/results/${data.id}`);
    },
  });

  // Keep refs in sync with state
  useEffect(() => {
    attemptIdRef.current = attemptId;
    answersRef.current = answers;
    currentQuestionIndexRef.current = currentQuestionIndex;
    questionsRef.current = questions || null;
  }, [attemptId, answers, currentQuestionIndex, questions]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/resources?redirect=/ai-pm-readiness/questions");
      return;
    }

    // Only create attempt if we're not already loading resume data
    if (questions && !attemptId && !createAttemptMutation.isPending && resumeData !== undefined) {
      createAttemptMutation.mutate();
    }
  }, [isAuthenticated, questions, attemptId, createAttemptMutation.isPending, resumeData]);

  // Track assessment_dropped when user leaves without completing
  useEffect(() => {
    console.log("🎯 Assessment drop tracker mounted");
    
    const handleAssessmentDrop = () => {
      // Prevent duplicate tracking
      if (hasTrackedDropRef.current) {
        console.log("⏭️ Drop already tracked, skipping");
        return;
      }
      
      const currentQuestions = questionsRef.current;
      console.log("🔔 handleAssessmentDrop called", {
        hasQuestions: !!currentQuestions,
        isCompleted: assessmentCompletedRef.current,
        hasAttemptId: !!attemptIdRef.current,
        answersCount: Object.keys(answersRef.current).length
      });
      
      if (currentQuestions && !assessmentCompletedRef.current && attemptIdRef.current) {
        const totalQuestions = currentQuestions.length;
        const currentQuestionIndex = currentQuestionIndexRef.current;
        const currentQuestion = currentQuestions[currentQuestionIndex];
        
        // Count all answered questions (simply the number of saved answers)
        const allAnswers = answersRef.current;
        const answeredQuestions = Object.keys(allAnswers).length;
        
        console.log("🚪 Assessment dropped:", {
          totalQuestions,
          answeredQuestions,
          currentQuestion: currentQuestion?.questionText || "Unknown question"
        });
        
        trackEvent("assessment_dropped", {
          totalQuestions: totalQuestions,
          answeredQuestions: answeredQuestions,
          currentQuestion: currentQuestion?.questionText || "Unknown question"
        });
        
        hasTrackedDropRef.current = true;
      }
    };

    // Only track on beforeunload (page close/refresh) and component unmount (React navigation)
    // Removed visibilitychange to avoid duplicate events when user switches tabs
    window.addEventListener("beforeunload", handleAssessmentDrop);
    console.log("📌 Event listeners registered");

    // Cleanup event listeners and track on component unmount (React navigation)
    return () => {
      console.log("🧹 Cleanup running - component unmounting");
      window.removeEventListener("beforeunload", handleAssessmentDrop);
      handleAssessmentDrop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - cleanup only on unmount, reads from refs

  if (!isAuthenticated || loadingQuestions || !questions || (!attemptId && createAttemptMutation.isPending)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p style={{ color: "#9ca3af" }} data-testid="text-loading">Loading...</p>
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p style={{ color: "#ef4444" }} data-testid="text-error">Failed to create assessment attempt. Please try again.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const totalQuestions = questions.length;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    // Synchronously update refs to avoid race condition with unmount
    answersRef.current = newAnswers;

    saveAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answerValue: value,
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        // Synchronously update index ref
        currentQuestionIndexRef.current = nextIndex;
      } else {
        completeAssessmentMutation.mutate();
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      // Synchronously update index ref
      currentQuestionIndexRef.current = prevIndex;
    }
  };

  const getDimensionLabel = (dimension: string) => {
    const parts = dimension.split("&");
    return parts[0].trim();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Section: {getDimensionLabel(currentQuestion.dimension)}
            </p>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-medium mb-6" style={{ color: "#111111" }}>
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-3">
                {ANSWER_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={answers[currentQuestion.id] === option.value ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto py-4 px-6"
                    onClick={() => handleAnswer(option.value)}
                    data-testid={`button-answer-${option.value}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 font-semibold">{option.value}</span>
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {currentQuestionIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mt-4"
                data-testid="button-back"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
