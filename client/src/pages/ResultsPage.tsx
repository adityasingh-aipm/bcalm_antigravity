import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, Loader2, CheckCircle, AlertTriangle, Zap, Target, FileText, 
  ArrowRight, RefreshCw, ChevronDown, ChevronUp, Share2, Copy, Check,
  Sparkles, TrendingUp, List, HelpCircle, ExternalLink, FileSearch, Briefcase,
  AlertCircle, Lightbulb, Edit3, MessageSquare, CircleCheck, CircleX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface TopRequirement {
  requirement: string;
  evidence_quality: string;
  resume_evidence: string;
}

interface GapItem {
  gap?: string;
  title?: string;
  why_it_matters?: string;
  proof_needed?: string;
  bullet_frame?: string;
}

interface BulletReviewItem {
  original?: string;
  original_bullet?: string;
  why_weak?: string;
  recommended?: string;
  recommended_text?: string;
  recommended_version?: string;
  why_this_version?: string;
  placeholders?: string[];
  fill?: string[];
}

interface SevenStepItem {
  step?: number;
  action: string;
  priority?: string;
  output?: string;
}

interface AnalysisJob {
  id: string;
  status: string;
  report: {
    role_preset?: string;
    overall_score?: number;
    rating?: string;
    score_breakdown?: {
      ats?: { score: number; max?: number; feedback?: string; notes?: string };
      impact?: { score: number; max?: number; feedback?: string; notes?: string };
      role_signals?: { score: number; max?: number; feedback?: string; notes?: string };
      job_match?: { score: number; max?: number; feedback?: string; notes?: string; skipped?: boolean };
    };
    summary?: string;
    coach_summary?: string;
    top_strengths?: Array<{ point: string; evidence?: string; why_it_works?: string } | string>;
    top_fixes?: Array<{ point: string; expected_lift?: number; why?: string; why_weak?: string; recommended?: string; how_to_do_it?: string; ref?: string } | string>;
    seven_step_plan?: SevenStepItem[];
    bullet_review?: BulletReviewItem[];
    info_needed_from_user?: string[];
    // Fields can be at root or in job_match_section
    top_requirements?: TopRequirement[];
    highest_roi_gaps?: GapItem[];
    gaps?: GapItem[] | string[];
    job_match_section?: {
      match_score?: number | null;
      explanation?: string;
      missing_skills?: string[];
      strong_matches?: string[];
      requirements?: Array<{ requirement: string; met: boolean }>;
      top_requirements?: TopRequirement[];
      gaps?: GapItem[] | string[];
      highest_roi_gaps?: GapItem[];
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
  maxScore,
  notes, 
  icon: Icon,
  skipped 
}: { 
  title: string; 
  score: number;
  maxScore?: number;
  notes?: string; 
  icon: any;
  skipped?: boolean;
}) {
  const getScoreColor = (score: number, max: number = 100) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-yellow-400";
    if (pct >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const max = maxScore || 100;

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
        <div className={`text-2xl font-bold ${skipped ? 'text-white/30' : getScoreColor(score, max)}`}>
          {skipped ? '—' : `${score}/${max}`}
        </div>
        <div className="text-white/60 text-sm font-medium mt-1">{title}</div>
        {notes && !skipped && (
          <p className="text-white/40 text-xs mt-2 line-clamp-3">{notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

function EvidenceQualityBadge({ quality }: { quality: string }) {
  const normalizedQuality = quality?.toLowerCase() || '';
  
  if (normalizedQuality.includes('strong') || normalizedQuality === 'present') {
    return (
      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
        <CircleCheck className="h-3 w-3 mr-1" />
        Strong evidence
      </Badge>
    );
  }
  if (normalizedQuality.includes('missing') || normalizedQuality === 'absent') {
    return (
      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
        <CircleX className="h-3 w-3 mr-1" />
        Missing
      </Badge>
    );
  }
  if (normalizedQuality.includes('weak') || normalizedQuality.includes('partial')) {
    return (
      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
        <AlertCircle className="h-3 w-3 mr-1" />
        Weak
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-white/10 text-white/60 border-white/20 text-xs">
      {quality}
    </Badge>
  );
}

function RequirementTypeBadge({ type }: { type: string }) {
  const normalizedType = type?.toLowerCase() || '';
  
  if (normalizedType.includes('must') || normalizedType === 'required') {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
        must_have
      </Badge>
    );
  }
  if (normalizedType.includes('nice') || normalizedType === 'preferred') {
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
        nice_to_have
      </Badge>
    );
  }
  return null;
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { jobId } = useParams();
  const { toast } = useToast();
  
  const [jobMatchOpen, setJobMatchOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const report = jobData.report || {} as any;
  const score = report.overall_score || 0;
  const rating = report.rating;
  const statusInfo = rating ? { label: rating, color: getStatusLabel(score).color } : getStatusLabel(score);
  const coachSummary = report.coach_summary || report.summary || "";
  const breakdown = report.score_breakdown || {};
  const strengths = report.top_strengths || [];
  const fixes = report.top_fixes || [];
  const sevenStepPlan = report.seven_step_plan || [];
  const bulletReview = report.bullet_review || [];
  const infoNeeded = report.info_needed_from_user || [];
  const jobMatchSection = report.job_match_section || {};
  // Only skip if explicitly marked as skipped or no JD was provided
  const jobMatchSkipped = breakdown.job_match?.skipped === true;
  
  // Top requirements can be at job_match_section.top_requirements or report.top_requirements
  const topRequirements: TopRequirement[] = 
    report.top_requirements || 
    jobMatchSection?.top_requirements || 
    [];
  
  // Highest ROI gaps can be at root level or inside job_match_section
  const extractGaps = (): GapItem[] => {
    if (report.highest_roi_gaps && Array.isArray(report.highest_roi_gaps)) {
      return report.highest_roi_gaps;
    }
    if (jobMatchSection?.highest_roi_gaps && Array.isArray(jobMatchSection.highest_roi_gaps)) {
      return jobMatchSection.highest_roi_gaps;
    }
    if (Array.isArray(report.gaps) && report.gaps.length > 0 && typeof report.gaps[0] === 'object') {
      return report.gaps as GapItem[];
    }
    if (Array.isArray(jobMatchSection?.gaps) && jobMatchSection.gaps.length > 0 && typeof jobMatchSection.gaps[0] === 'object') {
      return jobMatchSection.gaps as GapItem[];
    }
    return [];
  };
  const highestRoiGaps = extractGaps();
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Report data:', {
      hasTopRequirements: topRequirements.length > 0,
      hasHighestRoiGaps: highestRoiGaps.length > 0,
      topRequirementsCount: topRequirements.length,
      highestRoiGapsCount: highestRoiGaps.length,
      jobMatchSkipped,
      rawReport: report
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033] pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-8">
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

        {/* Hero Section with Score */}
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

        {/* Score Breakdown - 2x2 Grid */}
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
              title="ATS / Structure"
              score={breakdown.ats?.score || 0}
              maxScore={breakdown.ats?.max || 20}
              notes={breakdown.ats?.feedback || breakdown.ats?.notes}
              icon={FileSearch}
            />
            <BreakdownCard
              title="Impact"
              score={breakdown.impact?.score || 0}
              maxScore={breakdown.impact?.max || 30}
              notes={breakdown.impact?.feedback || breakdown.impact?.notes}
              icon={Zap}
            />
            <BreakdownCard
              title="Role Signals"
              score={breakdown.role_signals?.score || 0}
              maxScore={breakdown.role_signals?.max || 20}
              notes={breakdown.role_signals?.feedback || breakdown.role_signals?.notes}
              icon={Target}
            />
            <BreakdownCard
              title="Job Match"
              score={breakdown.job_match?.score || 0}
              maxScore={breakdown.job_match?.max || 30}
              notes={breakdown.job_match?.feedback || breakdown.job_match?.notes}
              icon={Briefcase}
              skipped={jobMatchSkipped}
            />
          </div>
        </motion.section>

        {/* Coach Summary */}
        {coachSummary && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <Card className="bg-primary/10 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Coach Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 leading-relaxed" data-testid="text-coach-summary">
                  {coachSummary}
                </p>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Job Match Deep Dive with Requirements Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Collapsible open={jobMatchOpen} onOpenChange={setJobMatchOpen}>
            <Card className="bg-white/5 border-white/10">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
                  <CardTitle className="text-lg text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
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
                <CardContent className="space-y-6">
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
                    <>
                      {/* Explanation */}
                      {jobMatchSection?.explanation && (
                        <p className="text-white/70 text-sm leading-relaxed">
                          {jobMatchSection.explanation}
                        </p>
                      )}

                      {/* Top JD Requirements Table */}
                      {topRequirements.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <List className="h-4 w-4 text-primary" />
                            Top JD Requirements & Your Evidence
                          </h4>
                          <div className="overflow-x-auto">
                            <div className="min-w-[500px] space-y-2">
                              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 text-xs text-white/50 uppercase tracking-wider pb-2 border-b border-white/10">
                                <span>Requirement</span>
                                <span className="text-center">Evidence</span>
                                <span>Resume Evidence</span>
                              </div>
                              {topRequirements.map((req, index) => (
                                <div key={index} className="grid grid-cols-[1fr_auto_1fr] gap-3 py-3 border-b border-white/5 items-start">
                                  <div className="text-white/80 text-sm">{req.requirement}</div>
                                  <div className="flex justify-center">
                                    <EvidenceQualityBadge quality={req.evidence_quality} />
                                  </div>
                                  <div className="text-white/60 text-sm">
                                    {req.resume_evidence || <span className="text-white/30 italic">No evidence found in resume</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Strong Matches & Missing Skills */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {jobMatchSection?.strong_matches && jobMatchSection.strong_matches.length > 0 && (
                          <div>
                            <h4 className="text-green-400 text-sm font-medium mb-2">Strong Matches</h4>
                            <ul className="space-y-1">
                              {jobMatchSection.strong_matches.map((match: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-white/70 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
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
                                <li key={index} className="flex items-center gap-2 text-white/70 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.section>

        {/* Highest-ROI Gaps */}
        {highestRoiGaps.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <Card className="bg-red-500/10 border-red-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Highest-ROI Gaps to Close
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highestRoiGaps.map((gap, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                    <h4 className="text-white font-medium">{gap.gap || gap.title}</h4>
                    {gap.why_it_matters && (
                      <div>
                        <span className="text-xs text-yellow-400 uppercase tracking-wider">Why it matters</span>
                        <p className="text-white/60 text-sm mt-1">{gap.why_it_matters}</p>
                      </div>
                    )}
                    {gap.proof_needed && (
                      <div>
                        <span className="text-xs text-blue-400 uppercase tracking-wider">Proof needed</span>
                        <p className="text-white/60 text-sm mt-1">{gap.proof_needed}</p>
                      </div>
                    )}
                    {gap.bullet_frame && (
                      <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <span className="text-xs text-primary uppercase tracking-wider">Bullet frame</span>
                        <p className="text-white/80 text-sm mt-1 font-mono">{gap.bullet_frame}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Top Strengths & Fixes Side by Side */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {/* Top Strengths */}
          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Top Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {strengths.map((item: any, index: number) => (
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
                          {typeof item === 'string' ? item : (item.strength || item.point)}
                        </span>
                        {item.evidence && (
                          <p className="text-white/50 text-sm mt-1 italic">
                            "{item.evidence}"
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Highest ROI Fixes */}
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Highest ROI Fixes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {fixes.map((item: any, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white/80"
                  >
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-orange-400 mt-1 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium" data-testid={`text-fix-${index}`}>
                            {typeof item === 'string' ? item : (item.fix || item.point)}
                          </span>
                          {(item.expected_score_lift || item.expected_lift) && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              +{item.expected_score_lift || item.expected_lift} pts
                            </span>
                          )}
                        </div>
                        {item.how_to_do_it && (
                          <p className="text-white/50 text-sm mt-1 italic">
                            "{item.how_to_do_it}"
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        {/* Bullet-by-Bullet Rewrite Recommendations */}
        {bulletReview.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-8"
          >
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-amber-400" />
                  Bullet-by-Bullet Rewrite Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="grid grid-cols-[48px_1fr_1fr] border-b border-white/10 bg-white/5">
                  <div className="p-4 text-sm font-medium text-white/60">#</div>
                  <div className="p-4 text-sm font-medium text-white/60 border-l border-white/10">Before</div>
                  <div className="p-4 text-sm font-medium text-white/60 border-l border-white/10">After</div>
                </div>
                
                {/* Table Rows */}
                {bulletReview.map((item, index) => {
                  const originalText = item.original_bullet || item.original || '';
                  const recommendedText = item.recommended_text || item.recommended || '';
                  const placeholders = item.placeholders || item.fill || [];
                  
                  return (
                    <div 
                      key={index}
                      className="grid grid-cols-[48px_1fr_1fr] border-b border-white/10 last:border-b-0"
                      data-testid={`bullet-row-${index}`}
                    >
                      {/* Row Number */}
                      <div className="p-4 flex items-start justify-center">
                        <span className="text-white/60 font-medium">{index + 1}</span>
                      </div>
                      
                      {/* Before Column */}
                      <div className="p-4 border-l border-white/10 space-y-3">
                        <div>
                          <span className="text-sm font-medium text-white/50">Original</span>
                          <p className="text-white/80 mt-1 text-sm leading-relaxed">
                            {originalText}
                          </p>
                        </div>
                        {item.why_weak && (
                          <p className="text-sm">
                            <span className="font-medium text-amber-500">Why weak: </span>
                            <span className="text-amber-500/80">{item.why_weak}</span>
                          </p>
                        )}
                      </div>
                      
                      {/* After Column */}
                      <div className="p-4 border-l border-white/10 space-y-3">
                        <div>
                          <span className="text-sm font-medium text-white/50">Recommended rewrite</span>
                          <p className="text-white/90 mt-1 text-sm leading-relaxed">
                            {recommendedText}
                          </p>
                        </div>
                        {item.why_this_version && (
                          <p className="text-sm">
                            <span className="font-medium text-green-500">Why this version: </span>
                            <span className="text-green-500/80">{item.why_this_version}</span>
                          </p>
                        )}
                        {placeholders.length > 0 && (
                          <p className="text-sm">
                            <span className="font-medium text-white/50">Fill: </span>
                            <span className="text-white/60">{placeholders.join(', ')}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Info to Fill Placeholders */}
        {infoNeeded.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Info to Fill Placeholders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {infoNeeded.map((question: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-white/70">
                      <HelpCircle className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                      <span className="text-sm">{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* 7-Step Improvement Plan */}
        {sevenStepPlan.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mb-8"
          >
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-400" />
                  7-Step Improvement Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {sevenStepPlan.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + index * 0.05 }}
                    className="grid grid-cols-[100px_1fr] border-b border-white/10 last:border-b-0"
                    data-testid={`step-row-${index}`}
                  >
                    {/* Step Number */}
                    <div className="p-4 flex items-start">
                      <span className="text-white font-semibold">Step {item.step || index + 1}</span>
                    </div>
                    
                    {/* Action and Output */}
                    <div className="p-4 border-l border-white/10 space-y-1">
                      <p className="text-white/90 leading-relaxed">{item.action}</p>
                      {item.output && (
                        <p className="text-sm">
                          <span className="text-white/40">Output: </span>
                          <span className="text-white/50">{item.output}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* CTA Banner */}
        {report.cta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl p-6 text-center mb-8"
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-white font-medium">{report.cta}</p>
          </motion.div>
        )}
      </div>

      {/* Sticky Footer CTAs */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-0 left-0 right-0 bg-[#0a0014]/95 backdrop-blur-lg border-t border-white/10 p-4 z-50"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
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
        </div>
      </motion.div>
    </div>
  );
}
