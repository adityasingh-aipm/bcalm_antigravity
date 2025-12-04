import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Briefcase, RefreshCw, ChevronRight, ChevronLeft, Loader2, Target, Clock, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CurrentStatus = "student_fresher" | "working_professional" | "switching_careers";
type ExperienceOption = 0 | 1 | 2 | 3 | 4;

interface OnboardingData {
  status: string;
  currentStatus: CurrentStatus | null;
  targetRole: string;
  yearsExperience: ExperienceOption | null;
}

const STATUS_OPTIONS = [
  { value: "student_fresher", label: "Student / Fresher", icon: GraduationCap, description: "Currently studying or recently graduated" },
  { value: "working_professional", label: "Working Professional", icon: Briefcase, description: "Currently employed and looking to grow" },
  { value: "switching_careers", label: "Switching Careers", icon: RefreshCw, description: "Transitioning from another field" },
] as const;

const EXPERIENCE_OPTIONS = [
  { value: 0, label: "Just starting", description: "0 years" },
  { value: 1, label: "1-2 years", description: "Early career" },
  { value: 2, label: "3-5 years", description: "Mid-level" },
  { value: 3, label: "6-9 years", description: "Experienced" },
  { value: 4, label: "10+ years", description: "Senior level" },
] as const;

const ROLE_SUGGESTIONS: Record<CurrentStatus, string[]> = {
  student_fresher: [
    "Product Manager",
    "Associate PM",
    "Business Analyst",
    "Data Analyst",
    "Software Engineer",
    "UX Designer",
    "Not sure yet",
  ],
  working_professional: [
    "Senior Product Manager",
    "Product Lead",
    "Growth PM",
    "Technical PM",
    "Data Product Manager",
    "AI/ML Product Manager",
    "Not sure yet",
  ],
  switching_careers: [
    "Product Manager",
    "Associate PM",
    "Product Analyst",
    "Technical PM",
    "Growth PM",
    "Strategy PM",
    "Not sure yet",
  ],
};

function saveOnboardingData(data: OnboardingData) {
  localStorage.setItem("cv_onboarding", JSON.stringify(data));
}

function loadOnboardingData(): OnboardingData | null {
  try {
    const stored = localStorage.getItem("cv_onboarding");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState<ExperienceOption | null>(null);
  const [customRole, setCustomRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = loadOnboardingData();
    if (data) {
      if (data.status === "complete") {
        navigate("/upload");
        return;
      }
      if (data.currentStatus) setCurrentStatus(data.currentStatus);
      if (data.targetRole) setTargetRole(data.targetRole);
      if (data.yearsExperience !== null) setYearsExperience(data.yearsExperience);
    }
  }, [navigate]);

  const handleStatusSelect = (status: CurrentStatus) => {
    setCurrentStatus(status);
    const exp = status === "student_fresher" ? 0 : null;
    if (status === "student_fresher") {
      setYearsExperience(0);
    }
    saveOnboardingData({
      status: "in_progress",
      currentStatus: status,
      targetRole,
      yearsExperience: exp,
    });
    setStep(2);
  };

  const handleRoleSelect = (role: string) => {
    if (role === "Not sure yet") {
      setTargetRole("");
    } else {
      setTargetRole(role);
    }
  };

  const handleRoleNext = () => {
    const finalRole = customRole || targetRole;
    saveOnboardingData({
      status: currentStatus === "student_fresher" ? "complete" : "in_progress",
      currentStatus,
      targetRole: finalRole,
      yearsExperience,
    });
    
    if (currentStatus === "student_fresher") {
      navigate("/upload");
    } else {
      setStep(3);
    }
  };

  const handleExperienceSelect = (exp: ExperienceOption) => {
    setYearsExperience(exp);
    saveOnboardingData({
      status: "in_progress",
      currentStatus,
      targetRole: customRole || targetRole,
      yearsExperience: exp,
    });
  };

  const handleComplete = () => {
    saveOnboardingData({
      status: "complete",
      currentStatus,
      targetRole: customRole || targetRole,
      yearsExperience,
    });
    navigate("/upload");
  };

  const handleSkip = () => {
    saveOnboardingData({
      status: "complete",
      currentStatus,
      targetRole: customRole || targetRole,
      yearsExperience,
    });
    navigate("/upload");
  };

  const totalSteps = currentStatus === "student_fresher" ? 2 : 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110022] to-[#1a0033] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur border-white/10">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">BCALM</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle className="text-2xl text-white">
            {step === 1 && "Let's personalize your experience"}
            {step === 2 && "What role are you targeting?"}
            {step === 3 && "How much experience do you have?"}
          </CardTitle>
          <CardDescription className="text-white/60">
            {step === 1 && "This helps us tailor your CV analysis"}
            {step === 2 && "We'll optimize your CV for this role"}
            {step === 3 && "This helps us benchmark your CV appropriately"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusSelect(option.value as CurrentStatus)}
                      disabled={isLoading}
                      className={`w-full p-4 rounded-lg border transition-all flex items-center gap-4 text-left ${
                        currentStatus === option.value
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/20 hover:border-primary/50 hover:bg-white/5 text-white/80"
                      }`}
                      data-testid={`button-status-${option.value}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{option.label}</div>
                        <div className="text-sm text-white/60">{option.description}</div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 2 && currentStatus && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-2">
                  {ROLE_SUGGESTIONS[currentStatus].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        targetRole === role || (role === "Not sure yet" && !targetRole && !customRole)
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/20 hover:border-primary/50 text-white/80"
                      }`}
                      data-testid={`button-role-${role.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <Input
                    placeholder="Or type a custom role..."
                    value={customRole}
                    onChange={(e) => {
                      setCustomRole(e.target.value);
                      setTargetRole("");
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    data-testid="input-custom-role"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-back"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleRoleNext}
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="button-next-step2"
                  >
                    {currentStatus === "student_fresher" ? "See my CV score" : "Next"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <button
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full text-center text-white/50 hover:text-white/80 text-sm py-2"
                  data-testid="button-skip-role"
                >
                  <SkipForward className="h-4 w-4 inline mr-1" />
                  Skip for now
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {EXPERIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleExperienceSelect(option.value as ExperienceOption)}
                    disabled={isLoading}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center gap-4 ${
                      yearsExperience === option.value
                        ? "border-primary bg-primary/20 text-white"
                        : "border-white/20 hover:border-primary/50 hover:bg-white/5 text-white/80"
                    }`}
                    data-testid={`button-exp-${option.value}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-white/60">{option.description}</div>
                    </div>
                  </button>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-back-step3"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="button-see-cv-score"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    See my CV score
                  </Button>
                </div>
                
                <button
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full text-center text-white/50 hover:text-white/80 text-sm py-2"
                  data-testid="button-skip-exp"
                >
                  <SkipForward className="h-4 w-4 inline mr-1" />
                  Skip for now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
