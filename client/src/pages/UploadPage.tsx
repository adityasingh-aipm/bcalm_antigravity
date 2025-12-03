import { useState, useRef, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface OnboardingStatus {
  onboardingStatus: string;
  currentStatus: string | null;
  targetRole: string | null;
  yearsExperience: number | null;
  personalizationQuality: string | null;
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Upload, FileText, Loader2, X, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const showJd = searchParams.get("jd") === "true";
  
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [showJdInput, setShowJdInput] = useState(showJd);
  const [dragActive, setDragActive] = useState(false);

  const { data: onboardingData, isLoading: onboardingLoading } = useQuery<OnboardingStatus>({
    queryKey: ["/api/onboarding/status"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
      return;
    }
    if (!onboardingLoading && onboardingData?.onboardingStatus !== "complete") {
      navigate("/onboarding");
    }
  }, [authLoading, isAuthenticated, onboardingLoading, onboardingData, navigate]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      
      const formData = new FormData();
      formData.append("cv", file);
      if (jdText.trim()) {
        formData.append("jdText", jdText.trim());
      }
      
      const response = await fetch("/api/analysis/submit", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit CV");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/analysis/user/jobs"] });
      navigate(`/processing?jobId=${data.jobId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your CV first",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate();
  };

  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#110022] to-[#1a0033]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">BCALM</span>
        </div>

        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Upload Your CV</CardTitle>
            <CardDescription className="text-white/60">
              We'll analyze your CV and provide personalized recommendations
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : file
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-white/20 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                data-testid="input-cv-file"
              />
              
              {file ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium" data-testid="text-file-name">{file.name}</p>
                      <p className="text-white/60 text-sm">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="text-white/60 hover:text-white"
                    data-testid="button-remove-file"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    Drag and drop your CV here
                  </p>
                  <p className="text-white/60 text-sm mb-4">
                    or click to browse (PDF, DOC, DOCX)
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-browse-files"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              )}
            </div>

            {showJdInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <label className="text-white/80 text-sm font-medium">
                  Job Description (optional)
                </label>
                <Textarea
                  placeholder="Paste the job description here for more tailored analysis..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  data-testid="textarea-jd"
                />
              </motion.div>
            )}

            {!showJdInput && (
              <button
                onClick={() => setShowJdInput(true)}
                className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                data-testid="button-add-jd"
              >
                <span>+ Add job description for better analysis</span>
              </button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!file || submitMutation.isPending}
              className="w-full h-12 text-lg"
              data-testid="button-analyze-cv"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Analyze My CV
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-2">
              <AlertCircle className="h-4 w-4 text-white/40" />
              <button
                onClick={() => window.open("/coming-soon/cv-samples", "_blank")}
                className="text-white/40 hover:text-white/60 text-sm flex items-center gap-1"
                data-testid="button-cv-samples"
              >
                Don't have a CV? See best CV samples
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white/40 hover:text-white/60 text-sm"
            data-testid="button-go-dashboard"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
