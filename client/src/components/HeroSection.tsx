import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Please fill all fields",
        description: "Name and mobile number are required.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          utmSource: urlParams.get("utm_source") || undefined,
          utmMedium: urlParams.get("utm_medium") || undefined,
          utmCampaign: urlParams.get("utm_campaign") || undefined,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }
      
      trackEvent("lead_submitted", {
        source: "hero_form"
      });
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Lead submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen overflow-hidden" 
      style={{ paddingTop: '60px' }}
    >
      {/* Dark gradient background */}
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
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 md:mb-8"
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
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 md:mb-6">
            <span className="block">Crack Your Dream Job</span>
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in 30 Days
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 md:mb-10 font-medium">
            Free AI CV Score + 30-Day Personalized Plan
          </p>
          
          {/* Lead Capture Form Card */}
          <motion.div
            id="lead-form-card"
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                      <Label htmlFor="name" className="text-white/80 text-sm font-medium">Full Name</Label>
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
                      <Label htmlFor="phone" className="text-white/80 text-sm font-medium">Mobile Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                        required
                        data-testid="input-phone"
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full h-12 text-base font-semibold rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                      }}
                      disabled={isSubmitting}
                      data-testid="button-start-free"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Start for free
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-white/80 text-base mb-2">
                    You've taken the first step toward your dream job!
                  </p>
                  <p className="text-white/60 text-sm">
                    We'll reach out to you soon to get started.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Trust Line */}
          <p className="text-sm md:text-base text-white/60 mt-8 mb-4">
            Trusted by Students from IITs, BITS, NITs & IIMs
          </p>
          
          {/* College Chips */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
            {["IIT", "BITS", "NIT", "IIM"].map((college) => (
              <span 
                key={college}
                className="px-4 py-1.5 rounded-full text-xs md:text-sm font-medium text-white/80"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {college}
              </span>
            ))}
          </div>
          
          {/* Success Stories with Avatars */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-[#0a0014]" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-[#0a0014]" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#0a0014]" />
            </div>
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">200+</span> success stories
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
