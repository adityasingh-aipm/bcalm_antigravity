import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, BookOpen, Sparkles } from "lucide-react";

interface ShareData {
  displayName: string;
  readinessBand: string;
  scoreRange: string;
  totalScore: number;
}

export default function ShareResultsPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [, setLocation] = useLocation();

  const { data: shareData, isLoading, error } = useQuery<ShareData>({
    queryKey: ["/api/assessment/share", shareToken],
    queryFn: async () => {
      const response = await fetch(`/api/assessment/share/${shareToken}`);
      if (!response.ok) {
        throw new Error("Share link not found");
      }
      return response.json();
    },
  });

  const getBandIcon = (band: string) => {
    switch (band) {
      case "Internship Ready":
        return <Trophy className="h-12 w-12" style={{ color: "#6c47ff" }} />;
      case "On Track":
        return <TrendingUp className="h-12 w-12" style={{ color: "#6c47ff" }} />;
      case "Building Foundation":
        return <BookOpen className="h-12 w-12" style={{ color: "#6c47ff" }} />;
      default:
        return <Sparkles className="h-12 w-12" style={{ color: "#6c47ff" }} />;
    }
  };

  const getBandEmoji = (band: string) => {
    switch (band) {
      case "Internship Ready":
        return "🏆";
      case "On Track":
        return "📈";
      case "Building Foundation":
        return "📚";
      default:
        return "🌱";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">Loading shared results...</p>
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-4">Share Link Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This share link may be invalid or the assessment results may not be available.
          </p>
          <Button onClick={() => setLocation("/ai-pm-readiness")} data-testid="button-take-assessment">
            Take the AI PM Readiness Check
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: "#111111" }}>
            {shareData.displayName}'s AI PM Readiness Check Results
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden" style={{ borderColor: "#e5e5e5" }}>
            <div
              className="p-8 text-center"
              style={{
                background: "linear-gradient(135deg, #6c47ff 0%, #5a3dd9 100%)",
              }}
            >
              <div className="flex justify-center mb-4">
                {getBandIcon(shareData.readinessBand)}
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                {shareData.readinessBand} {getBandEmoji(shareData.readinessBand)}
              </h2>
              <p className="text-white/90 text-sm md:text-base">
                Score Range: {shareData.scoreRange} / 120
              </p>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-base md:text-lg" style={{ color: "#4a5568" }}>
                    "I just completed the <span className="font-semibold">Bcalm AI PM Readiness Check</span> and
                    scored <span className="font-semibold">{shareData.readinessBand}</span>.
                  </p>
                  <p className="text-base md:text-lg mt-4" style={{ color: "#4a5568" }}>
                    Want to see where you stand across 8 AI PM skills?"
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg text-center"
                  style={{ background: "#f8f7ff" }}
                >
                  <p className="text-sm font-medium mb-2" style={{ color: "#6c47ff" }}>
                    Take the Free Assessment
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    24 questions • 10 minutes • Instant personalized report
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto px-8"
                    onClick={() => setLocation("/ai-pm-readiness")}
                    data-testid="button-take-my-assessment"
                  >
                    Take the AI PM Readiness Check
                  </Button>
                  <p className="text-xs mt-4" style={{ color: "#9ca3af" }}>
                    Powered by Bcalm • Free forever
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#111111" }}>
            What You'll Discover
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ background: "#f8f7ff" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "#111111" }}>
                8 Skill Dimensions
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                Product Thinking, AI/ML, Data & Metrics, and more
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "#f8f7ff" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "#111111" }}>
                Personalized Gap Analysis
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                See exactly where to focus your learning
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "#f8f7ff" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "#111111" }}>
                Readiness Band
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                From Early Explorer to Internship Ready
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
