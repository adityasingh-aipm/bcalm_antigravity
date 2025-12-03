import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GraduationCap, Loader2, CheckCircle, AlertTriangle, Zap, Target, FileText, ArrowRight, RefreshCw, ChevronDown, ChevronUp, TrendingUp, List, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisJob {
  id: string;
  status: string;
  result_json: any;
  error_text: string | null;
  created_at: string;
  completed_at: string | null;
}

interface OnboardingStatus {
  onboardingStatus: string;
  currentStatus: string | null;
  targetRole: string | null;
  yearsExperience: number | null;
  personalizationQuality: string | null;
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { jobId } = useParams();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [rawJsonOpen, setRawJsonOpen] = useState(false);

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

  useEffect(() => {
    if (jobData && jobData.status !== "complete") {
      navigate(`/processing?jobId=${jobId}`);
    }
  }, [jobData, jobId, navigate]);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const result = jobData.result_json || {};
  const score = result.overall_score || 0;
  const summary = result.summary || "";
  const scoreBreakdown = result.score_breakdown || {};
  const topStrengths = result.top_strengths || [];
  const topFixes = result.top_fixes || [];
  const sevenStepPlan = result.seven_step_plan || [];
  const infoNeeded = result.info_needed_from_user || [];
  const bulletReview = result.bullet_review || [];
  const needsTargetRole = !onboardingData?.targetRole || infoNeeded.length > 0;
  const needsJd = result.job_match_section?.match_score === null;

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

        {summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6"
          >
            <p className="text-white/80" data-testid="text-summary">{summary}</p>
          </motion.div>
        )}

        {Object.keys(scoreBreakdown).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {Object.entries(scoreBreakdown).map(([key, value]: [string, any]) => (
              <Card key={key} className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(value.score || 0)}`}>
                    {value.score || 0}
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">
                    {key.replace(/_/g, ' ')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        <div className="space-y-6">
          {topStrengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-green-500/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    What's Strong
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {topStrengths.map((item: any, index: number) => (
                      <li key={index} className="text-white/80">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                          <div>
                            <span className="font-medium" data-testid={`text-strength-${index}`}>
                              {typeof item === 'string' ? item : item.point}
                            </span>
                            {item.evidence && (
                              <p className="text-white/50 text-sm mt-1">{item.evidence}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {topFixes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Top Fixes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {topFixes.map((item: any, index: number) => (
                      <li key={index} className="text-white/80">
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-yellow-400 mt-1 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium" data-testid={`text-fix-${index}`}>
                                {typeof item === 'string' ? item : item.point}
                              </span>
                              {item.expected_lift && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                  +{item.expected_lift} pts
                                </span>
                              )}
                            </div>
                            {item.recommended && (
                              <p className="text-white/50 text-sm mt-1">{item.recommended}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {sevenStepPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <List className="h-5 w-5" />
                    7-Step Improvement Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {sevenStepPlan.map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium shrink-0">
                          {item.step || index + 1}
                        </span>
                        <div className="flex-1">
                          <span className="text-white/80">{item.action}</span>
                          {item.priority && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-white/10 text-white/50'
                            }`}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {infoNeeded.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-blue-500/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Questions for Better Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {infoNeeded.map((question: string, index: number) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(needsTargetRole || needsJd) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Improve Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {needsTargetRole && !onboardingData?.targetRole && (
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
                  {needsJd && (
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Collapsible open={rawJsonOpen} onOpenChange={setRawJsonOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-white/50 hover:text-white/80 hover:bg-white/5"
                >
                  <span>Raw JSON (Debug)</span>
                  {rawJsonOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="bg-black/30 rounded-lg p-4 text-xs text-white/60 overflow-x-auto mt-2 max-h-96 overflow-y-auto">
                  {JSON.stringify(jobData.result_json, null, 2)}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
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
