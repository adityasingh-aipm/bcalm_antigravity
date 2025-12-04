import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  GraduationCap, Loader2, CheckCircle, AlertTriangle, Zap, Target, FileText, 
  ArrowRight, RefreshCw, ChevronDown, ChevronUp, Share2, Copy, Check,
  Sparkles, TrendingUp, List, HelpCircle, ExternalLink, FileSearch, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AnalysisJob {
  id: string;
  status: string;
  report: {
    role_preset?: string;
    overall_score?: number;
    score_breakdown?: {
      ats?: { score: number; feedback?: string; notes?: string };
      impact?: { score: number; feedback?: string; notes?: string };
      role_signals?: { score: number; feedback?: string; notes?: string };
      job_match?: { score: number; feedback?: string; notes?: string; skipped?: boolean };
    };
    summary?: string;
    top_strengths?: Array<{ point: string; evidence?: string; why_it_works?: string } | string>;
    top_fixes?: Array<{ point: string; expected_lift?: number; why_weak?: string; recommended?: string; how_to_do_it?: string } | string>;
    seven_step_plan?: Array<{ step?: number; action: string; priority?: string }>;
    bullet_review?: Array<{ original: string; why_weak?: string; recommended?: string; placeholders?: string[] }>;
    info_needed_from_user?: string[];
    job_match_section?: {
      match_score?: number | null;
      missing_skills?: string[];
      strong_matches?: string[];
      requirements?: Array<{ requirement: string; met: boolean }>;
      gaps?: string[];
    };
    cta?: string;
  };
  error_text: string | null;
  created_at: string;
  completed_at: string | null;
}

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 10px ${getScoreColor(score)}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-5xl font-bold text-white"
          data-testid="text-score"
        >
          {score}
        </motion.span>
        <span className="text-white/50 text-sm">/100</span>
      </div>
    </div>
  );
}

function getStatusLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "text-green-400" };
  if (score >= 60) return { label: "Strong", color: "text-yellow-400" };
  if (score >= 40) return { label: "Good foundation", color: "text-orange-400" };
  return { label: "Needs work", color: "text-red-400" };
}

function BreakdownCard({ 
  title, 
  score, 
  notes, 
  icon: Icon,
  skipped 
}: { 
  title: string; 
  score: number; 
  notes?: string; 
  icon: any;
  skipped?: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          {skipped && (
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
              JD missing
            </span>
          )}
        </div>
        <div className={`text-3xl font-bold ${skipped ? 'text-white/30' : getScoreColor(score)}`}>
          {skipped ? '—' : score}
        </div>
        <div className="text-white/60 text-sm font-medium mt-1">{title}</div>
        {notes && !skipped && (
          <p className="text-white/40 text-xs mt-2 line-clamp-2">{notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { jobId } = useParams();
  const { toast } = useToast();
  
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllFixes, setShowAllFixes] = useState(false);
  const [bulletReviewOpen, setBulletReviewOpen] = useState(false);
  const [jobMatchOpen, setJobMatchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedFixes, setExpandedFixes] = useState<Set<number>>(new Set());

  const { data: jobData, isLoading, refetch } = useQuery<AnalysisJob>({
    queryKey: ["/api/analysis/share", jobId],
    enabled: !!jobId,
    staleTime: 60000,
    gcTime: 300000,
    retry: 2,
  });

  useEffect(() => {
    if (!jobId) {
      navigate("/upload");
    }
  }, [jobId, navigate]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${jobId}`;
    const shareText = `I scored ${report.overall_score}/100 for ${report.role_preset || 'my CV'}. Get your free CV score at bcalm.org`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My CV Score on bcalm",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/share/${jobId}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFixExpand = (index: number) => {
    const newExpanded = new Set(expandedFixes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFixes(newExpanded);
  };

  if (isLoading || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white/70">
            {jobData.status === "processing" ? "Still analyzing your CV..." : "Loading results..."}
          </p>
          {jobData.status === "processing" && (
            <Button
              variant="ghost"
              className="mt-4 text-white/50"
              onClick={() => navigate(`/processing?jobId=${jobId}`)}
              data-testid="button-view-processing"
            >
              View progress
            </Button>
          )}
        </div>
      </div>
    );
  }

  const report = jobData.report || {};
  const score = report.overall_score || 0;
  const statusInfo = getStatusLabel(score);
  const summaryFirstSentence = report.summary?.split('.')[0] || "";
  const breakdown = report.score_breakdown || {};
  const strengths = report.top_strengths || [];
  const fixes = report.top_fixes || [];
  const sevenStepPlan = report.seven_step_plan || [];
  const bulletReview = report.bullet_review || [];
  const infoNeeded = report.info_needed_from_user || [];
  const jobMatchSection = report.job_match_section;
  const jobMatchSkipped = breakdown.job_match?.skipped || jobMatchSection?.match_score === null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033] pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">BCALM</span>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-6">
            <ScoreRing score={score} />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className={`text-xl font-semibold ${statusInfo.color}`} data-testid="text-status">
              {statusInfo.label}
            </span>
            
            {report.role_preset && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                  <Target className="h-3 w-3" />
                  {report.role_preset}
                </span>
              </div>
            )}
            
            {summaryFirstSentence && (
              <p className="text-white/70 mt-4 max-w-md mx-auto" data-testid="text-summary">
                {summaryFirstSentence}.
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
          >
            <Button
              onClick={() => navigate("/upload")}
              className="gap-2"
              data-testid="button-rescore-hero"
            >
              <RefreshCw className="h-4 w-4" />
              Re-score after edits
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/upload?jd=true")}
              className="gap-2 border-white/20 text-white hover:bg-white/10"
              data-testid="button-upload-jd-hero"
            >
              <FileText className="h-4 w-4" />
              Upload JD for fit match
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-3 mt-4"
          >
            <span className="text-white/50 text-sm">Share your score</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-copy-link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Score Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <BreakdownCard
              title="ATS Score"
              score={breakdown.ats?.score || 0}
              notes={breakdown.ats?.feedback || breakdown.ats?.notes}
              icon={FileSearch}
            />
            <BreakdownCard
              title="Impact"
              score={breakdown.impact?.score || 0}
              notes={breakdown.impact?.feedback || breakdown.impact?.notes}
              icon={Zap}
            />
            <BreakdownCard
              title="Role Signals"
              score={breakdown.role_signals?.score || 0}
              notes={breakdown.role_signals?.feedback || breakdown.role_signals?.notes}
              icon={Target}
            />
            <BreakdownCard
              title="Job Match"
              score={breakdown.job_match?.score || 0}
              notes={breakdown.job_match?.feedback || breakdown.job_match?.notes}
              icon={Briefcase}
              skipped={jobMatchSkipped}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Top Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(showAllStrengths ? strengths : strengths.slice(0, 3)).map((item: any, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white/80"
                  >
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
                  </motion.li>
                ))}
              </ul>
              {strengths.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllStrengths(!showAllStrengths)}
                  className="w-full mt-3 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                >
                  {showAllStrengths ? "Show less" : `Show all ${strengths.length}`}
                  {showAllStrengths ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Highest ROI Fixes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(showAllFixes ? fixes : fixes.slice(0, 3)).map((item: any, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white/80"
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => item.how_to_do_it && toggleFixExpand(index)}
                    >
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-orange-400 mt-1 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium" data-testid={`text-fix-${index}`}>
                              {typeof item === 'string' ? item : item.point}
                            </span>
                            {item.expected_lift && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                +{item.expected_lift} pts
                              </span>
                            )}
                          </div>
                          {item.recommended && (
                            <p className="text-white/50 text-sm mt-1">{item.recommended}</p>
                          )}
                          <AnimatePresence>
                            {expandedFixes.has(index) && item.how_to_do_it && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 p-2 bg-white/5 rounded-lg"
                              >
                                <p className="text-white/60 text-sm">{item.how_to_do_it}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {item.how_to_do_it && (
                          <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${expandedFixes.has(index) ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
              {fixes.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllFixes(!showAllFixes)}
                  className="w-full mt-3 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                >
                  {showAllFixes ? "Show less" : `Show all ${fixes.length}`}
                  {showAllFixes ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {sevenStepPlan.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-primary/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <List className="h-5 w-5" />
                  7-Step Improvement Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-primary/20" />
                  <ol className="space-y-4">
                    {sevenStepPlan.map((item: any, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex items-start gap-4 relative"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium shrink-0 z-10">
                          {item.step || index + 1}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <span className="text-white/80">{item.action}</span>
                          {item.priority && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-white/10 text-white/50'
                            }`}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {bulletReview.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Collapsible open={bulletReviewOpen} onOpenChange={setBulletReviewOpen}>
              <Card className="bg-white/5 border-white/10">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
                    <CardTitle className="text-lg text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Bullet Review Deep Dive
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">
                          {bulletReview.length} items
                        </span>
                      </span>
                      {bulletReviewOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {bulletReview.map((item: any, index: number) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                        <div>
                          <span className="text-xs text-white/40 uppercase tracking-wider">Original</span>
                          <p className="text-white/60 mt-1">{item.original}</p>
                        </div>
                        {item.why_weak && (
                          <div>
                            <span className="text-xs text-red-400 uppercase tracking-wider">Why it's weak</span>
                            <p className="text-white/60 mt-1">{item.why_weak}</p>
                          </div>
                        )}
                        {item.recommended && (
                          <div>
                            <span className="text-xs text-green-400 uppercase tracking-wider">Recommended</span>
                            <p className="text-white/80 mt-1">{item.recommended}</p>
                          </div>
                        )}
                        {item.placeholders && item.placeholders.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.placeholders.map((placeholder: string, pIndex: number) => (
                              <span key={pIndex} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                {placeholder}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Collapsible open={jobMatchOpen} onOpenChange={setJobMatchOpen}>
            <Card className="bg-white/5 border-white/10">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
                  <CardTitle className="text-lg text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Job Match Deep Dive
                      {jobMatchSkipped && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                          JD missing
                        </span>
                      )}
                    </span>
                    {jobMatchOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  {jobMatchSkipped ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-white/30" />
                      </div>
                      <h3 className="text-white font-medium mb-2">No Job Description Provided</h3>
                      <p className="text-white/50 mb-4 max-w-sm mx-auto">
                        Upload a job description to see how well your CV matches the requirements
                      </p>
                      <Button
                        onClick={() => navigate("/upload?jd=true")}
                        className="gap-2"
                        data-testid="button-upload-jd-match"
                      >
                        <FileText className="h-4 w-4" />
                        Upload JD
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobMatchSection?.strong_matches && jobMatchSection.strong_matches.length > 0 && (
                        <div>
                          <h4 className="text-green-400 text-sm font-medium mb-2">Strong Matches</h4>
                          <ul className="space-y-1">
                            {jobMatchSection.strong_matches.map((match: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-white/70">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                {match}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {jobMatchSection?.missing_skills && jobMatchSection.missing_skills.length > 0 && (
                        <div>
                          <h4 className="text-orange-400 text-sm font-medium mb-2">Missing Skills</h4>
                          <ul className="space-y-1">
                            {jobMatchSection.missing_skills.map((skill: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-white/70">
                                <AlertTriangle className="h-4 w-4 text-orange-400" />
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {jobMatchSection?.gaps && jobMatchSection.gaps.length > 0 && (
                        <div>
                          <h4 className="text-red-400 text-sm font-medium mb-2">Gaps to Address</h4>
                          <ul className="space-y-1">
                            {jobMatchSection.gaps.map((gap: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-white/70">
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.section>

        {infoNeeded.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
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
                    <li key={index} className="flex items-start gap-2 text-white/70">
                      <HelpCircle className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {report.cta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl p-6 text-center mb-8"
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-white font-medium">{report.cta}</p>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-0 left-0 right-0 bg-[#0a0014]/95 backdrop-blur-lg border-t border-white/10 p-4 z-50"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <Button
            onClick={() => navigate("/upload")}
            className="flex-1 gap-2"
            data-testid="button-rescore-sticky"
          >
            <RefreshCw className="h-4 w-4" />
            Re-score after edits
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/upload?jd=true")}
            className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
            data-testid="button-upload-jd-sticky"
          >
            <FileText className="h-4 w-4" />
            Upload JD
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-white/70 hover:text-white hover:bg-white/10"
            data-testid="button-share-sticky"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
