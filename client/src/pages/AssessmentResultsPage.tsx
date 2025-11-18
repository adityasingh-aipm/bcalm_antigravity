import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Target, Share2, Copy, Check } from "lucide-react";
import { SiLinkedin, SiWhatsapp } from "react-icons/si";

const DIMENSION_INFO: Record<string, { description: string; how_bcalm_helps: string }> = {
  "Product & Problem Thinking": {
    description: "You struggle to define clear problem statements, jump to solutions without measurable outcomes, or find it hard to prioritize features.",
    how_bcalm_helps: "In Module 1: Product & Problem Thinking for AI, you will practice writing problem statements from vague prompts, learn how to define success metrics, and work on structured case prompts similar to AI PM interviews.",
  },
  "AI/ML Fundamentals": {
    description: "You lack clarity on AI/ML concepts like supervised learning, classification vs. regression, or struggle to explain how recommendation systems and NLP work.",
    how_bcalm_helps: "In Module 2: AI/ML Foundations, you will learn core concepts through real product examples, understand when to use different ML approaches, and build confidence discussing AI systems with engineers.",
  },
  "Data & Metrics": {
    description: "You find it challenging to define the right metrics, struggle with understanding model performance indicators, or confuse correlation with causation.",
    how_bcalm_helps: "In Module 3: Metrics & Data Analysis, you will practice defining success metrics for AI features, learn to evaluate model performance using precision, recall, and F1 scores, and develop data-driven decision-making skills.",
  },
  "User Research & Empathy": {
    description: "You're unsure how to conduct user interviews, struggle to create personas or user journeys, or find it difficult to translate user insights into product ideas.",
    how_bcalm_helps: "In Module 4: User Research for AI Products, you will learn frameworks for conducting effective interviews, practice creating user personas and journey maps, and develop empathy-driven product thinking.",
  },
  "Product Strategy & Roadmapping": {
    description: "You don't know how to break down a big vision into shippable milestones, struggle with prioritization frameworks, or find trade-offs between speed, quality, and scope challenging.",
    how_bcalm_helps: "In Module 5: Product Strategy, you will master prioritization frameworks like RICE and MoSCoW, learn to create realistic roadmaps, and practice making strategic trade-off decisions.",
  },
  "Communication & Stakeholder Management": {
    description: "You find it hard to explain technical AI concepts to non-technical people, feel uncomfortable presenting to groups, or struggle to align different stakeholders.",
    how_bcalm_helps: "In Module 6: Communication Skills, you will practice translating technical jargon into simple language, develop presentation skills through mock scenarios, and learn stakeholder alignment techniques.",
  },
  "Technical Collaboration": {
    description: "You can't read basic code snippets, don't understand APIs or data flows, or struggle to ask smart questions about feasibility and timelines with engineers.",
    how_bcalm_helps: "In Module 7: Technical Fluency for PMs, you will learn to read basic Python code, understand API documentation, discuss integration challenges, and ask informed questions about model deployment.",
  },
  "AI Ethics & Responsible Design": {
    description: "You're unfamiliar with bias in AI systems, don't think about privacy and user consent, or can't discuss examples of AI failures and how to avoid them.",
    how_bcalm_helps: "In Module 8: AI Ethics & Responsible Design, you will study real-world AI failures, learn to identify and mitigate bias, and develop frameworks for building ethical AI products.",
  },
};

export default function AssessmentResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: result, isLoading } = useQuery<{ attempt: any; user: any; answerCount: number }>({
    queryKey: ["/api/assessment/results", attemptId],
    enabled: isAuthenticated && !!attemptId,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/resources?redirect=/ai-pm-readiness");
    }
  }, [isAuthenticated, setLocation]);

  const shareUrl = result?.attempt?.shareToken
    ? `${window.location.origin}/ai-pm-readiness/share/${result.attempt.shareToken}`
    : "";

  const getBandEmoji = (band: string) => {
    if (band === "Internship Ready") return "🏆";
    if (band === "On Track") return "📈";
    if (band === "Building Foundation") return "📚";
    return "🌱";
  };

  const shareText = result
    ? `I just completed the Bcalm AI PM Readiness Check and scored ${result.attempt.readinessBand} ${getBandEmoji(result.attempt.readinessBand)}!\n\nWant to see where you stand across 8 AI PM skills?\nTake the free assessment:`
    : "";

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleLinkedInShare = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleWhatsAppShare = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (!isAuthenticated || isLoading || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p style={{ color: "#9ca3af" }}>Loading your results...</p>
      </div>
    );
  }

  const { attempt } = result;
  const dimensionScores = attempt.scoresJson ? JSON.parse(attempt.scoresJson) : {};
  const totalScore = attempt.totalScore || 0;
  const maxScore = 120;
  const readinessBand = attempt.readinessBand || "Early Explorer";

  const getBandColor = (band: string) => {
    if (band === "Internship Ready") return "#10b981";
    if (band === "On Track") return "#3b82f6";
    if (band === "Building Foundation") return "#f59e0b";
    return "#8b5cf6";
  };

  const getBandMessage = (band: string) => {
    if (band === "Internship Ready") {
      return "You're close to interview-ready. Bcalm helps you turn this into a standout portfolio and interview success.";
    }
    if (band === "On Track") {
      return "You're making good progress. You have strong foundations in several areas and need targeted improvements in others.";
    }
    if (band === "Building Foundation") {
      return "You're early in your AI PM journey. You already show strength in some areas, but need to build foundations to become internship-ready.";
    }
    return "You're exactly who Bcalm was designed for. This program will give you the foundations you need to excel in AI PM roles.";
  };

  const getScoreColor = (score: number) => {
    if (score >= 12) return "#10b981";
    if (score >= 9) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 12) return "Strong";
    if (score >= 9) return "Developing";
    return "Needs Work";
  };

  const weakDimensions = Object.entries(dimensionScores)
    .filter(([, score]) => (score as number) < 10)
    .sort(([, a], [, b]) => (a as number) - (b as number));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ background: "#f5f3ff" }}>
              <p className="text-sm font-medium" style={{ color: "#6c47ff" }}>Your AI PM Readiness Score</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2" style={{ color: getBandColor(readinessBand) }}>
              {totalScore} / {maxScore}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "#111111" }}>
              {readinessBand}
            </p>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4a5568" }}>
              {getBandMessage(readinessBand)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => setLocation("/#curriculum")} data-testid="button-view-curriculum">
              <BookOpen className="h-4 w-4 mr-2" />
              See How Bcalm Helps
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/#pricing")} data-testid="button-join-waitlist">
              Join the Waitlist
            </Button>
          </div>

          {shareUrl && (
            <Card className="mb-12" style={{ background: "#f8f7ff", borderColor: "#e5e5e5" }}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Share2 className="h-5 w-5" style={{ color: "#6c47ff" }} />
                    <h3 className="text-lg font-semibold" style={{ color: "#111111" }}>
                      Share Your Readiness Profile
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    Inspire your peers to discover their AI PM strengths
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLinkedInShare}
                    className="gap-2"
                    data-testid="button-share-linkedin"
                  >
                    <SiLinkedin className="h-4 w-4" />
                    Share to LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWhatsAppShare}
                    className="gap-2"
                    data-testid="button-share-whatsapp"
                  >
                    <SiWhatsapp className="h-4 w-4" />
                    Share to WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="gap-2"
                    data-testid="button-copy-link"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Scores by Dimension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dimensionScores).map(([dimension, score]) => {
                  const scoreNum = score as number;
                  return (
                    <div key={dimension}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: "#111111" }}>
                          {dimension}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: getScoreColor(scoreNum) }}>
                            {scoreNum} / 15
                          </span>
                          <span className="text-xs px-2 py-1 rounded" style={{ background: "#f5f3ff", color: "#6c47ff" }}>
                            {getScoreLabel(scoreNum)}
                          </span>
                        </div>
                      </div>
                      <Progress value={(scoreNum / 15) * 100} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {weakDimensions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Growth Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weakDimensions.map(([dimension]) => {
                    const info = DIMENSION_INFO[dimension];
                    if (!info) return null;

                    return (
                      <div key={dimension} className="border-l-4 pl-4" style={{ borderColor: "#6c47ff" }}>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "#111111" }}>
                          {dimension}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: "#4a5568" }}>
                          {info.description}
                        </p>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-xs font-semibold mb-1" style={{ color: "#6c47ff" }}>
                            How Bcalm helps:
                          </p>
                          <p className="text-sm" style={{ color: "#4a5568" }}>
                            {info.how_bcalm_helps}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-12 p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#111111" }}>
              {readinessBand === "Internship Ready" || readinessBand === "On Track"
                ? "You're close to being interview-ready"
                : "Ready to bridge your gaps?"}
            </h3>
            <p className="text-sm mb-4" style={{ color: "#4a5568" }}>
              Join our next cohort and move from {totalScore} to 100+ with personalized mentorship and hands-on projects.
            </p>
            <Button onClick={() => setLocation("/#pricing")} data-testid="button-join-cohort">
              Join the Next Cohort
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
