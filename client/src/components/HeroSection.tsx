import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    resume: null as File | null
  });
  const [phoneError, setPhoneError] = useState("");

  const handleGetCvScore = () => {
    navigate("/start");
  };

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }
    setPhoneError("");
    
    if (formData.name && formData.phoneNumber) {
      trackEvent("cv_score_step1_completed", {
        name: formData.name
      });
      setStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) return;
    
    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("cv", formData.resume);
      
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("utm_source")) submitData.append("utmSource", urlParams.get("utm_source")!);
      if (urlParams.get("utm_medium")) submitData.append("utmMedium", urlParams.get("utm_medium")!);
      if (urlParams.get("utm_campaign")) submitData.append("utmCampaign", urlParams.get("utm_campaign")!);
      
      const response = await fetch("/api/cv/submit", {
        method: "POST",
        body: submitData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit CV");
      }
      
      trackEvent("cv_score_step2_completed", {
        name: formData.name,
        hasResume: true
      });
      
      setShowSuccess(true);
    } catch (error) {
      console.error("CV submission error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const scrollToForm = () => {
    const formCard = document.getElementById('cv-form-card');
    if (formCard) {
      const navbarHeight = 60;
      const offset = 20; // Extra padding below navbar
      const elementPosition = formCard.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen overflow-hidden" 
      style={{ paddingTop: '60px' }}
    >
      {/* Dark gradient background - Seekho inspired */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #0a0014 0%, #1a0a2e 40%, #12082a 70%, #0a0014 100%)',
        }}
      />
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Top Badge - Seekho style pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 md:mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(75, 0, 130, 0.3) 100%)',
              border: '1px solid rgba(138, 43, 226, 0.4)',
              boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)',
            }}
          >
            <span className="text-xs md:text-sm font-medium text-white/90">
              India's Fastest-Growing AI Interview Prep Platform
            </span>
          </motion.div>
          
          {/* Main Headline - Two lines, large and bold */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 md:mb-6">
            <span className="block">Crack Your Dream Job</span>
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in 30 Days
            </span>
          </h1>
          
          {/* Form Card - Floating style */}
          <motion.div
            id="cv-form-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-[420px] mx-auto"
          >
            <div 
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: 'rgba(30, 20, 50, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(138, 43, 226, 0.1)',
              }}
            >
              {!showSuccess ? (
                <>
                  {step === 1 ? (
                    <form onSubmit={handleStep1Submit} className="space-y-4">
                      <div className="text-left">
                        <Label htmlFor="name" className="text-white/80 text-sm font-medium">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                          required
                          data-testid="input-name"
                        />
                      </div>
                      
                      <div className="text-left">
                        <Label htmlFor="phoneNumber" className="text-white/80 text-sm font-medium">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={formData.phoneNumber}
                          onChange={(e) => {
                            setFormData({ ...formData, phoneNumber: e.target.value });
                            if (phoneError) setPhoneError("");
                          }}
                          className={`mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl ${phoneError ? 'border-red-500' : ''}`}
                          required
                          data-testid="input-phone"
                        />
                        {phoneError && (
                          <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                        )}
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full h-12 text-base font-semibold rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                        }}
                        data-testid="button-get-cv-score"
                      >
                        Start for free
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleStep2Submit} className="space-y-4">
                      <div className="text-left">
                        <Label htmlFor="resume" className="text-white/80 text-sm font-medium">Upload Resume (PDF or DOCX)</Label>
                        <div className="mt-2">
                          <label 
                            htmlFor="resume" 
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-violet-500/60 transition-colors bg-white/5"
                          >
                            <Upload className="w-8 h-8 text-white/40 mb-2" />
                            <span className="text-sm text-white/70">
                              {formData.resume ? formData.resume.name : "Click to upload"}
                            </span>
                            <span className="text-xs text-white/40 mt-1">PDF, DOCX up to 5MB</span>
                            <input 
                              id="resume" 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.docx,.doc"
                              onChange={handleFileChange}
                              data-testid="input-resume"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-white/50 mt-2">
                          We'll analyze your CV and email your score & roadmap.
                        </p>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full h-12 text-base font-semibold rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                        }}
                        disabled={!formData.resume || isSubmitting}
                        data-testid="button-submit-cv"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit CV"
                        )}
                      </Button>
                    </form>
                  )}
                </>
              ) : (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">You're in!</h3>
                  <p className="text-white/70 text-sm">
                    We'll email your CV Score and roadmap within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Urgency Microcopy */}
          <p className="mt-4 text-xs md:text-sm text-amber-400/80">
            37 students joined this week · Limited slots available
          </p>
        </motion.div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </section>
  );
}
