import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Loader2, Target, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiLinkedin, SiX } from "react-icons/si";

interface ShareData {
  id: string;
  status: string;
  share_data: {
    overall_score: number;
    role_preset: string;
    summary: string;
    top_strength: string;
  };
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 10;
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
          className="text-4xl font-bold text-white"
        >
          {score}
        </motion.span>
        <span className="text-white/50 text-xs">/100</span>
      </div>
    </div>
  );
}

export default function SharePage() {
  const { jobId } = useParams();

  const { data, isLoading, error } = useQuery<ShareData>({
    queryKey: ["/api/analysis/share", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/analysis/share/${jobId}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: !!jobId,
  });

  useEffect(() => {
    if (data) {
      document.title = `CV Score: ${data.share_data.overall_score}/100 | bcalm`;
    }
  }, [data]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${data?.share_data.overall_score}/100 for ${data?.share_data.role_preset}. Get your free CV score at bcalm.org`)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0014] via-[#110022] to-[#1a0033]">
        <div className="text-center text-white px-4">
          <h2 className="text-xl font-semibold mb-2">Score not found</h2>
          <p className="text-white/60 mb-4">This score may have been removed or is no longer available.</p>
          <Button onClick={() => window.location.href = "/"} data-testid="button-get-score">
            Get Your Free CV Score
          </Button>
        </div>
      </div>
    );
  }

  const { share_data } = data;

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
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">BCALM</span>
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
            <ScoreRing score={share_data.overall_score} />
          </div>

          {share_data.role_preset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center mb-4"
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                <Target className="h-3 w-3" />
                {share_data.role_preset}
              </span>
            </motion.div>
          )}

          {share_data.top_strength && (
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
              <p className="text-white/80 text-sm">{share_data.top_strength}</p>
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
              onClick={() => window.location.href = "/"}
              className="w-full gap-2"
              data-testid="button-try-yours"
            >
              <ExternalLink className="h-4 w-4" />
              bcalm.org
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
