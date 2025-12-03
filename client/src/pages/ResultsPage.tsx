import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

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

interface OnboardingStatus {
  onboardingStatus: string;
  currentStatus: string | null;
  targetRole: string | null;
  yearsExperience: number | null;
  personalizationQuality: string | null;
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Loader2, CheckCircle, AlertTriangle, Zap, Target, FileText, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { jobId } = useParams();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
      return;
    }
    if (!jobId) {
      navigate("/upload");
    }
  }, [authLoading, isAuthenticated, jobId, navigate]);

  const { data: jobData, isLoading } = useQuery<AnalysisJob>({
    queryKey: ["/api/analysis", jobId],
    enabled: !!jobId && isAuthenticated,
  });

  const { data: onboardingData } = useQuery<OnboardingStatus>({
    queryKey: ["/api/onboarding/status"],
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
        <div className="text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Analysis not found</h2>
          <Button onClick={() => navigate("/upload")} data-testid="button-new-analysis">
            Start new analysis
          </Button>
        </div>
      </div>
    );
  }

  if (jobData.status !== "complete") {
    navigate(`/processing?jobId=${jobId}`);
    return null;
  }

  const score = jobData.score || 0;
  const strengths = (jobData.strengths as string[]) || [];
  const gaps = (jobData.gaps as string[]) || [];
  const quickWins = (jobData.quickWins as string[]) || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">BCALM</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl text-white/80 mb-4">Your CV Readiness Score</h1>
          
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-40 h-40 rounded-full bg-white/5 border-4 border-primary/30 flex items-center justify-center mx-auto"
            >
              <div className="text-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-5xl font-bold ${getScoreColor(score)}`}
                  data-testid="text-score"
                >
                  {score}
                </motion.span>
                <span className="text-white/60 text-lg">/100</span>
              </div>
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-lg font-medium mt-4 ${getScoreColor(score)}`}
            data-testid="text-score-label"
          >
            {getScoreLabel(score)}
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-green-500/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    What's Strong
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strengths.map((item, index) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                        <span data-testid={`text-strength-${index}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {gaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    What Recruiters Will Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {gaps.map((item, index) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-1 shrink-0" />
                        <span data-testid={`text-gap-${index}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {quickWins.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Fastest Upgrades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quickWins.map((item, index) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <Zap className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span data-testid={`text-quickwin-${index}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(jobData.needsTargetRole || jobData.needsJd) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Improve Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobData.needsTargetRole && !onboardingData?.targetRole && (
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                      onClick={() => navigate("/onboarding?edit=role")}
                      data-testid="button-add-target-role"
                    >
                      <span className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Add target role for sharper scoring
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  {jobData.needsJd && (
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                      onClick={() => navigate("/upload?jd=true")}
                      data-testid="button-add-jd"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Add JD to check fit
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {jobData.notes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <p className="text-white/70 text-sm italic" data-testid="text-notes">
                {jobData.notes}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={() => navigate("/upload")}
            className="flex-1"
            data-testid="button-rescore"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-score after edits
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            data-testid="button-dashboard"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
