import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ScoreRing";
import { 
  Loader2, CheckCircle, AlertTriangle, Zap, Target, FileText, 
  RefreshCw, ChevronDown, ChevronUp, Share2, Copy, Check,
  Sparkles, TrendingUp, HelpCircle, FileSearch, Briefcase,
  AlertCircle, Lightbulb, Edit3, Send, X, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  placeholders_to_fill?: string[];
}

interface SevenStepItem {
  step?: number;
  task?: string;
  action?: string;
  priority?: string;
  output?: string;
  output_expected?: string;
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
    top_strengths?: Array<{ strength?: string; point?: string; evidence?: string; why_it_works?: string } | string>;
    top_fixes?: Array<{ fix?: string; point?: string; expected_score_lift?: number; expected_lift?: number; how_to_do_it?: string; why_it_matters?: string } | string>;
    seven_step_plan?: SevenStepItem[];
    bullet_review?: BulletReviewItem[];
    info_needed_from_user?: string[];
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

function BreakdownCard({ 
  title, 
  score,
  maxScore = 30,
  notes, 
  icon: Icon,
  skipped,
  expanded,
  onToggle
}: { 
  title: string; 
  score: number;
  maxScore?: number;
  notes?: string; 
  icon: any;
  skipped?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const pct = (score / maxScore) * 100;
  const getColor = () => {
    if (skipped) return "text-white/40";
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-primary";
    if (pct >= 40) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <Card 
      className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors"
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${getColor()}`} />
            <span className="text-white/70 text-sm font-medium">{title}</span>
          </div>
          {skipped ? (
            <Badge variant="outline" className="bg-white/5 text-white/40 border-white/10 text-xs">
              JD missing
            </Badge>
          ) : (
            <span className={`text-2xl font-bold ${getColor()}`}>{score}</span>
          )}
        </div>
        {notes && (
          <p className={`mt-2 text-xs ${expanded ? 'line-clamp-none' : 'line-clamp-2'} text-white/50`}>
            {notes}
          </p>
        )}
        <div className="flex items-center justify-end mt-2">
          <span className="text-xs text-white/30 flex items-center gap-1">
            {expanded ? 'Less' : 'View details'} 
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EvidenceQualityBadge({ quality }: { quality: string }) {
  const normalized = quality?.toLowerCase() || '';
  if (normalized.includes('strong') || normalized.includes('good')) {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Strong</Badge>;
  }
  if (normalized.includes('partial') || normalized.includes('weak')) {
    return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Partial</Badge>;
  }
  if (normalized.includes('missing') || normalized.includes('none')) {
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Missing</Badge>;
  }
  return <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">{quality}</Badge>;
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { jobId } = useParams();
  const { toast } = useToast();
  
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [bulletReviewOpen, setBulletReviewOpen] = useState(false);
  const [jobMatchOpen, setJobMatchOpen] = useState(false);
  const [infoNeededOpen, setInfoNeededOpen] = useState(false);

  const { data: jobData, isLoading } = useQuery<AnalysisJob>({
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
    const shareText = `I scored ${report.overall_score}/100 for ${report.role_preset || 'my CV'}. Get your free CV Score at bcalm.org`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My CV Score on BCALM",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        setShareModalOpen(true);
      }
    } else {
      setShareModalOpen(true);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/share/${jobId}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/share/${jobId}`;
    const text = `I scored ${report.overall_score}/100 for ${report.role_preset || 'my CV'}. Get your free CV Score at bcalm.org`;
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const toggleCardExpand = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  if (isLoading || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobData || jobData.status !== 'complete') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033] p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-white/70">Analyzing your CV...</p>
        <p className="text-white/40 text-sm mt-2">This usually takes 30-60 seconds</p>
      </div>
    );
  }

  const report = jobData.report || {};
  const score = report.overall_score || 0;
  const breakdown = report.score_breakdown || {};
  const strengths = report.top_strengths || [];
  const fixes = report.top_fixes || [];
  const sevenStepPlan = report.seven_step_plan || [];
  const bulletReview = report.bullet_review || [];
  const infoNeeded = report.info_needed_from_user || [];
  
  const topRequirements = report.top_requirements || report.job_match_section?.top_requirements || [];
  const highestRoiGaps = report.highest_roi_gaps || report.job_match_section?.highest_roi_gaps || [];
  const jobMatchSkipped = breakdown.job_match?.skipped;

  const quickestWin = fixes[0];
  const coachSummary = report.summary?.split('.')[0] + '.' || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-8 pb-12 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
              bcalm
            </span>
          </motion.div>

          {/* Score Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <ScoreRing score={score} size={180} />
          </motion.div>

          {/* Role Preset Pill */}
          {report.role_preset && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 text-sm mb-4">
                <Briefcase className="h-3.5 w-3.5 mr-2" />
                Target role: {report.role_preset}
              </Badge>
            </motion.div>
          )}

          {/* Coach Summary */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 max-w-2xl mx-auto text-sm md:text-base"
          >
            {coachSummary}
          </motion.p>
        </div>
      </motion.section>

      {/* Quickest Win Strip */}
      {quickestWin && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="px-4 mb-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <span className="text-amber-400 font-medium text-sm">Quickest win</span>
                  {(typeof quickestWin === 'object' && (quickestWin.expected_score_lift || quickestWin.expected_lift)) && (
                    <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      +{quickestWin.expected_score_lift || quickestWin.expected_lift} pts
                    </span>
                  )}
                  <p className="text-white/80 text-sm mt-0.5">
                    {typeof quickestWin === 'string' ? quickestWin : (quickestWin.fix || quickestWin.point)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Score Breakdown Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="px-4 mb-8"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white/70 text-sm font-medium mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" /> Score Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <BreakdownCard
              title="ATS Readability"
              score={breakdown.ats?.score || 0}
              maxScore={breakdown.ats?.max || 30}
              notes={breakdown.ats?.notes || breakdown.ats?.feedback}
              icon={FileSearch}
              expanded={expandedCards.has('ats')}
              onToggle={() => toggleCardExpand('ats')}
            />
            <BreakdownCard
              title="Impact & Metrics"
              score={breakdown.impact?.score || 0}
              maxScore={breakdown.impact?.max || 30}
              notes={breakdown.impact?.notes || breakdown.impact?.feedback}
              icon={TrendingUp}
              expanded={expandedCards.has('impact')}
              onToggle={() => toggleCardExpand('impact')}
            />
            <BreakdownCard
              title="Role Signals"
              score={breakdown.role_signals?.score || 0}
              maxScore={breakdown.role_signals?.max || 25}
              notes={breakdown.role_signals?.notes || breakdown.role_signals?.feedback}
              icon={Briefcase}
              expanded={expandedCards.has('role')}
              onToggle={() => toggleCardExpand('role')}
            />
            <BreakdownCard
              title="Job Match"
              score={breakdown.job_match?.score || 0}
              maxScore={breakdown.job_match?.max || 15}
              notes={breakdown.job_match?.notes || breakdown.job_match?.feedback}
              icon={Target}
              skipped={jobMatchSkipped}
              expanded={expandedCards.has('job')}
              onToggle={() => toggleCardExpand('job')}
            />
          </div>
        </div>
      </motion.section>

      {/* Strengths & Fixes - Two Column Layout */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="px-4 mb-8"
      >
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Top Strengths */}
          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-green-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                What you're already doing right
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(showAllStrengths ? strengths : strengths.slice(0, 3)).map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white/80 text-sm">
                      {typeof item === 'string' ? item : (item.strength || item.point)}
                    </p>
                    {item.evidence && (
                      <p className="text-white/40 text-xs mt-0.5 italic">"{item.evidence}"</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {strengths.length > 3 && (
                <button
                  onClick={() => setShowAllStrengths(!showAllStrengths)}
                  className="text-green-400 text-xs flex items-center gap-1 hover:underline"
                >
                  {showAllStrengths ? 'Show less' : `Show all ${strengths.length} strengths`}
                  {showAllStrengths ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
            </CardContent>
          </Card>

          {/* Highest ROI Fixes */}
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-amber-400 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                What will boost your score fastest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fixes.slice(0, 3).map((item: any, index: number) => (
                <Collapsible key={index}>
                  <CollapsibleTrigger className="w-full">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-left"
                    >
                      <Zap className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white/80 text-sm">
                            {typeof item === 'string' ? item : (item.fix || item.point)}
                          </span>
                          {(item.expected_score_lift || item.expected_lift) && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              +{item.expected_score_lift || item.expected_lift} pts
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-white/30 shrink-0" />
                    </motion.div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-2 space-y-2">
                    {item.how_to_do_it && (
                      <p className="text-white/50 text-xs">
                        <span className="text-amber-400/70">How: </span>{item.how_to_do_it}
                      </p>
                    )}
                    {item.why_it_matters && (
                      <p className="text-white/50 text-xs">
                        <span className="text-amber-400/70">Why: </span>{item.why_it_matters}
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* 7-Step Plan */}
      {sevenStepPlan.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="px-4 mb-8"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  7-Step Improvement Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {sevenStepPlan.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[80px_1fr] border-b border-white/10 last:border-b-0"
                  >
                    <div className="p-3 flex items-start">
                      <span className="text-white/70 font-medium text-sm">Step {item.step || index + 1}</span>
                    </div>
                    <div className="p-3 border-l border-white/10">
                      <p className="text-white/80 text-sm">{item.task || item.action}</p>
                      {(item.output_expected || item.output) && (
                        <p className="text-white/40 text-xs mt-1">
                          Output: {item.output_expected || item.output}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.section>
      )}

      {/* Deep Dive Sections - Collapsed by Default */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="px-4 mb-8"
      >
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Bullet Review */}
          {bulletReview.length > 0 && (
            <Collapsible open={bulletReviewOpen} onOpenChange={setBulletReviewOpen}>
              <CollapsibleTrigger className="w-full">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-primary" />
                      <span className="text-white/80 text-sm font-medium">Bullet Review</span>
                      <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10 text-xs">
                        {bulletReview.length}
                      </Badge>
                    </div>
                    {bulletReviewOpen ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                  </CardContent>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="bg-white/5 border-white/10 border-t-0 rounded-t-none overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[40px_1fr_1fr] border-b border-white/10 bg-white/5">
                      <div className="p-3 text-xs font-medium text-white/50">#</div>
                      <div className="p-3 text-xs font-medium text-white/50 border-l border-white/10">Before</div>
                      <div className="p-3 text-xs font-medium text-white/50 border-l border-white/10">After</div>
                    </div>
                    {bulletReview.map((item, index) => {
                      const originalText = item.original_bullet || item.original || '';
                      const recommendedText = item.recommended_text || item.recommended || '';
                      const placeholders = item.placeholders_to_fill || item.placeholders || item.fill || [];
                      
                      return (
                        <div key={index} className="grid grid-cols-[40px_1fr_1fr] border-b border-white/10 last:border-b-0">
                          <div className="p-3 flex items-start justify-center">
                            <span className="text-white/50 text-sm">{index + 1}</span>
                          </div>
                          <div className="p-3 border-l border-white/10 space-y-2">
                            <p className="text-white/60 text-xs leading-relaxed">{originalText}</p>
                            {item.why_weak && (
                              <p className="text-xs">
                                <span className="text-amber-500 font-medium">Why weak: </span>
                                <span className="text-amber-500/70">{item.why_weak}</span>
                              </p>
                            )}
                          </div>
                          <div className="p-3 border-l border-white/10 space-y-2">
                            <p className="text-white/80 text-xs leading-relaxed">{recommendedText}</p>
                            {item.why_this_version && (
                              <p className="text-xs">
                                <span className="text-green-500 font-medium">Why: </span>
                                <span className="text-green-500/70">{item.why_this_version}</span>
                              </p>
                            )}
                            {placeholders.length > 0 && (
                              <p className="text-xs">
                                <span className="text-white/40">Fill: </span>
                                <span className="text-white/50">{placeholders.join(', ')}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Job Match Deep Dive */}
          {(topRequirements.length > 0 || highestRoiGaps.length > 0) && (
            <Collapsible open={jobMatchOpen} onOpenChange={setJobMatchOpen}>
              <CollapsibleTrigger className="w-full">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-white/80 text-sm font-medium">Job Match Deep Dive</span>
                    </div>
                    {jobMatchOpen ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                  </CardContent>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="bg-white/5 border-white/10 border-t-0 rounded-t-none">
                  <CardContent className="p-4 space-y-4">
                    {topRequirements.length > 0 && (
                      <div>
                        <h4 className="text-white/70 text-xs font-medium mb-2">JD Requirements</h4>
                        <div className="space-y-2">
                          {topRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-start justify-between gap-2 p-2 bg-white/5 rounded-lg">
                              <div className="flex-1">
                                <p className="text-white/80 text-xs">{req.requirement}</p>
                                {req.resume_evidence && (
                                  <p className="text-white/40 text-xs mt-1 italic">"{req.resume_evidence}"</p>
                                )}
                              </div>
                              <EvidenceQualityBadge quality={req.evidence_quality} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {highestRoiGaps.length > 0 && (
                      <div>
                        <h4 className="text-white/70 text-xs font-medium mb-2">Skill Gaps</h4>
                        <div className="space-y-2">
                          {highestRoiGaps.map((gap, idx) => (
                            <div key={idx} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-white/80 text-xs">{gap.gap || gap.title}</p>
                              {gap.why_it_matters && (
                                <p className="text-white/40 text-xs mt-1">{gap.why_it_matters}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Empty state for Job Match */}
          {jobMatchSkipped && topRequirements.length === 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Upload a JD to unlock role-specific fit scoring.</p>
              </CardContent>
            </Card>
          )}

          {/* Info Needed */}
          {infoNeeded.length > 0 && (
            <Collapsible open={infoNeededOpen} onOpenChange={setInfoNeededOpen}>
              <CollapsibleTrigger className="w-full">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80 text-sm font-medium">Info Needed From You</span>
                      <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10 text-xs">
                        {infoNeeded.length}
                      </Badge>
                    </div>
                    {infoNeededOpen ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                  </CardContent>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="bg-white/5 border-white/10 border-t-0 rounded-t-none">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {infoNeeded.map((q, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {q}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </motion.section>

      {/* Bottom Action Row - Non-Sticky */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="px-4 pb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate("/upload")}
                className="w-full sm:w-auto gap-2"
                data-testid="button-rescore"
              >
                <RefreshCw className="h-4 w-4" />
                Re-score after edits
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/upload?jd=true")}
                className="w-full sm:w-auto gap-2 border-white/20 text-white hover:bg-white/10"
                data-testid="button-upload-jd"
              >
                <FileText className="h-4 w-4" />
                Upload JD for fit match
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/10">
              <span className="text-white/40 text-sm">Share your score</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-2 text-white/60 hover:text-white hover:bg-white/10"
                data-testid="button-share"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2 text-white/60 hover:text-white hover:bg-white/10"
                data-testid="button-copy-link"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="bg-[#1a0033] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Share Your Score</DialogTitle>
            <DialogDescription className="text-center text-white/50">
              Share your CV score with friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Mini Share Card Preview */}
            <div className="bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-lg p-4 text-center border border-primary/30">
              <p className="text-white/50 text-xs mb-1">I scored</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
              <p className="text-white/50 text-xs">/100 on BCALM</p>
              {report.role_preset && (
                <Badge className="mt-2 bg-primary/20 text-primary border-primary/30 text-xs">
                  {report.role_preset}
                </Badge>
              )}
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="gap-2 border-white/20 text-white hover:bg-white/10"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy link
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('whatsapp')}
                className="gap-2 border-white/20 text-white hover:bg-green-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('linkedin')}
                className="gap-2 border-white/20 text-white hover:bg-blue-500/20"
              >
                <Briefcase className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('twitter')}
                className="gap-2 border-white/20 text-white hover:bg-sky-500/20"
              >
                <span className="font-bold">𝕏</span>
                Twitter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
