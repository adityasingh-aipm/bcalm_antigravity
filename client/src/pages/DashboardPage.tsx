import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Loader2, Upload, FileText, Clock, CheckCircle, TrendingUp, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface AnalysisJob {
  id: string;
  status: string;
  score: number | null;
  cvFileName: string | null;
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

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const { data: onboardingData, isLoading: onboardingLoading } = useQuery<OnboardingStatus>({
    queryKey: ["/api/onboarding/status"],
    enabled: isAuthenticated,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery<AnalysisJob[]>({
    queryKey: ["/api/analysis/user/jobs"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!onboardingLoading && onboardingData?.onboardingStatus !== "complete") {
      navigate("/onboarding");
    }
  }, [onboardingLoading, onboardingData, navigate]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const latestScore = jobs?.find((j) => j.status === "complete")?.score;
  const totalAnalyses = jobs?.length || 0;
  const completedAnalyses = jobs?.filter((j) => j.status === "complete").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">BCALM</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-white/70">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.firstName || user?.email?.split("@")[0]}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/60 hover:text-white hover:bg-white/10"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-white/60">Track your CV improvement journey</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Latest Score</p>
                    <p className="text-2xl font-bold text-white" data-testid="text-latest-score">
                      {latestScore !== undefined ? `${latestScore}/100` : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Analyses Completed</p>
                    <p className="text-2xl font-bold text-white" data-testid="text-completed-count">
                      {completedAnalyses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Target Role</p>
                    <p className="text-lg font-semibold text-white truncate max-w-[150px]" data-testid="text-target-role">
                      {onboardingData?.targetRole || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">CV Analyses</CardTitle>
                  <CardDescription className="text-white/60">
                    Your recent CV analysis history
                  </CardDescription>
                </div>
                <Button onClick={() => navigate("/upload")} data-testid="button-new-upload">
                  <Upload className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => {
                        if (job.status === "complete") {
                          navigate(`/results/${job.id}`);
                        } else {
                          navigate(`/processing?jobId=${job.id}`);
                        }
                      }}
                      data-testid={`card-job-${job.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {job.cvFileName || "CV Analysis"}
                          </p>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Clock className="h-3 w-3" />
                            {format(new Date(job.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {job.status === "complete" && job.score !== null && (
                          <span className="text-lg font-bold text-white" data-testid={`text-job-score-${job.id}`}>
                            {job.score}/100
                          </span>
                        )}
                        <Badge
                          variant={job.status === "complete" ? "default" : "secondary"}
                          className={job.status === "complete" ? "bg-green-500/20 text-green-400" : ""}
                        >
                          {job.status === "complete" ? "Complete" : "Processing"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-white/40" />
                  </div>
                  <p className="text-white/60 mb-4">No analyses yet</p>
                  <Button onClick={() => navigate("/upload")} data-testid="button-first-upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload your first CV
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
