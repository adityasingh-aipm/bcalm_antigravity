import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Target, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiLinkedin, SiX } from "react-icons/si";
import { ScoreRing } from "@/components/ScoreRing";

interface ShareResponse {
  id: string;
  status: string;
  report: {
    overall_score?: number;
    role_preset?: string;
    summary?: string;
    top_strengths?: Array<{ strength?: string; point?: string } | string>;
  };
  error_text: string | null;
}

export default function SharePage() {
  const { jobId } = useParams();

  const { data, isLoading, error } = useQuery<ShareResponse>({
    queryKey: ["/api/analysis/share", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/analysis/share/${jobId}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: !!jobId,
  });

  const report = data?.report || {};
  const overallScore = report.overall_score || 0;
  const rolePreset = report.role_preset || '';
  
  const topStrength = report.top_strengths?.[0];
  const topStrengthText = typeof topStrength === 'string' 
    ? topStrength 
    : (topStrength?.strength || topStrength?.point || '');

  useEffect(() => {
    if (data?.status === 'complete' && overallScore) {
      document.title = `CV Score: ${overallScore}/100 | bcalm`;
    }
  }, [data, overallScore]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterShareUrl = data?.status === 'complete' 
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${overallScore}/100 for ${rolePreset || 'my CV'}. Get your free CV score at bcalm.org`)}&url=${encodeURIComponent(shareUrl)}`
    : '';
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data || data.status !== 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <div className="text-center text-white px-4">
          <h2 className="text-xl font-semibold mb-2">Score not found</h2>
          <p className="text-white/60 mb-4">This score may have been removed or is no longer available.</p>
          <Button onClick={() => window.location.href = "/score"} data-testid="button-get-score">
            Get Your Free CV Score
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-sm w-full"
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
              bcalm
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white/70 mb-6"
          >
            I got my CV Score on bcalm
          </motion.p>

          <div className="flex justify-center mb-6">
            <ScoreRing score={overallScore} size={140} />
          </div>

          {rolePreset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center mb-4"
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                <Target className="h-3 w-3" />
                {rolePreset}
              </span>
            </motion.div>
          )}

          {topStrengthText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                <Sparkles className="h-4 w-4" />
                Top Strength
              </div>
              <p className="text-white/80 text-sm">{topStrengthText}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <p className="text-white/50 text-sm mb-4">Try yours free at</p>
            <Button
              onClick={() => window.location.href = "/score"}
              className="w-full gap-2"
              data-testid="button-try-yours"
            >
              <ExternalLink className="h-4 w-4" />
              bcalm.org/score
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex justify-center gap-3"
        >
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            data-testid="link-share-twitter"
          >
            <SiX className="h-4 w-4" />
            Share on X
          </a>
          <a
            href={linkedinShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            data-testid="link-share-linkedin"
          >
            <SiLinkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
