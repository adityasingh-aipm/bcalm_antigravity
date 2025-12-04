import { useState, useRef, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Upload, FileText, Loader2, X, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface OnboardingData {
  status: string;
  currentStatus: string | null;
  targetRole: string;
  yearsExperience: number | null;
}

function loadOnboardingData(): OnboardingData | null {
  try {
    const stored = localStorage.getItem("cv_onboarding");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem("cv_session_id");
  if (!sessionId) {
    sessionId = nanoid();
    localStorage.setItem("cv_session_id", sessionId);
  }
  return sessionId;
}

export default function UploadPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const showJd = searchParams.get("jd") === "true";
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [showJdInput, setShowJdInput] = useState(showJd);
  const [dragActive, setDragActive] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const data = loadOnboardingData();
    if (!data || data.status !== "complete") {
      navigate("/onboarding");
      return;
    }
    setOnboardingData(data);
  }, [navigate]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      
      const sessionId = getOrCreateSessionId();
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("sessionId", sessionId);
      
      if (jdText.trim()) {
        formData.append("jdText", jdText.trim());
      }
      
      if (onboardingData) {
        formData.append("currentStatus", onboardingData.currentStatus || "");
        formData.append("targetRole", onboardingData.targetRole || "");
        formData.append("yearsExperience", String(onboardingData.yearsExperience ?? 0));
      }
      
      const response = await fetch("/api/analysis/submit-public", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit CV");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("cv_current_job_id", data.jobId);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">BCALM</span>
            </div>
            <CardTitle className="text-2xl text-white">Upload your CV</CardTitle>
            <CardDescription className="text-white/60">
              Get your personalized CV analysis powered by AI
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : file
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-white/20 hover:border-primary/50 hover:bg-white/5"
              }`}
              data-testid="dropzone-cv"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-file"
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-white/60 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-white/60 hover:text-white"
                    data-testid="button-remove-file"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    Drag & drop your CV here
                  </p>
                  <p className="text-white/60 text-sm">
                    or click to browse (PDF, DOC, DOCX)
                  </p>
                </>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowJdInput(!showJdInput)}
                className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                data-testid="button-toggle-jd"
              >
                <FileText className="h-4 w-4" />
                {showJdInput ? "Hide job description" : "Add job description (optional)"}
              </button>
              
              {showJdInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3"
                >
                  <Textarea
                    placeholder="Paste the job description here for more accurate feedback..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    data-testid="textarea-jd"
                  />
                </motion.div>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-white/80">
                <p className="font-medium text-white mb-1">What you'll get:</p>
                <ul className="list-disc list-inside space-y-1 text-white/60">
                  <li>Overall CV score out of 100</li>
                  <li>Detailed breakdown by category</li>
                  <li>Actionable improvements</li>
                  <li>Role-specific recommendations</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!file || submitMutation.isPending}
              className="w-full h-12 text-lg"
              data-testid="button-analyze"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Analyze my CV
                </>
              )}
            </Button>

            {onboardingData && (
              <div className="text-center text-white/40 text-sm">
                Targeting: {onboardingData.targetRole || "General role"} | 
                {" "}{onboardingData.currentStatus?.replace(/_/g, " ") || ""}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
