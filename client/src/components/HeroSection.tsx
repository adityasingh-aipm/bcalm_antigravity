import { Button } from "@/components/ui/button";
import { GraduationCap, Upload, Mic, FileCheck, MessageSquare, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import heroBackground from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '68px' }}>
      {/* Unified dark background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 0, 34, 0.98) 0%, rgba(26, 11, 46, 0.95) 30%, rgba(15, 12, 41, 0.92) 70%, rgba(11, 19, 43, 0.95) 100%), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-16" style={{ maxWidth: '1080px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Headline with subtle gradient glow anchor */}
          <div className="relative inline-block mx-auto mb-4 md:mb-5">
            {/* Subtle gradient glow behind headline */}
            <div 
              className="absolute inset-0 blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(108, 71, 255, 0.4), transparent 70%)',
                transform: 'scale(1.2)',
              }}
            />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight max-w-4xl">
              Become interview-ready for{" "}
              <span className="font-bold bg-gradient-to-r from-primary via-primary to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(106,61,240,0.5)]">
                any role
              </span>{" "}
              in{" "}
              <span className="font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                30 days
              </span>
            </h1>
          </div>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-2">
            Designed for early career professionals and students
          </p>
          
          {/* Founder Credibility - Highlighted Badge */}
          <div className="flex justify-center mb-4 md:mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-white">
                Created by founders from <span className="text-amber-400 font-semibold">IIT Delhi</span> and <span className="text-amber-400 font-semibold">IIM Calcutta</span>
              </span>
            </div>
          </div>
          
          {/* CTAs - Side by side on desktop, stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 sm:max-w-lg sm:mx-auto mb-6 md:mb-8 px-4 sm:px-0 justify-center sm:justify-center">
            {/* Primary CTA - Upload Resume */}
            <Link href="/coming-soon/upload-resume" className="block w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto text-base rounded-lg text-white hover:text-white border-0 py-3 md:py-4 px-6 md:px-8 bg-primary hover:bg-primary/90"
                onClick={() => {
                  trackEvent("upload_resume_clicked", {
                    device: navigator.userAgent
                  });
                }}
                data-testid="button-upload-resume"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
            </Link>

            {/* Secondary CTA - Practice Interviews */}
            <Link href="/coming-soon/practice-interviews" className="block w-full sm:w-auto">
              <Button 
                variant="outline"
                className="w-full sm:w-auto text-base rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/30 py-3 md:py-4 px-6 md:px-8"
                onClick={() => {
                  trackEvent("practice_interviews_clicked", {
                    device: navigator.userAgent
                  });
                }}
                data-testid="button-practice-interviews"
              >
                <Mic className="mr-2 h-5 w-5" />
                Practice Interviews
              </Button>
            </Link>
          </div>

          {/* Social Proof - Light styling, after CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 md:mb-10"
          >
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="h-4 w-4 flex-shrink-0 text-white/60" />
              <p className="text-xs sm:text-sm text-white/70">
                Trusted by <span className="font-semibold text-white/90">200+ students</span> from IITs, BITS, NITs & IIITs
              </p>
            </div>
          </motion.div>

          {/* Value Propositions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {/* Free CV Scoring */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-violet-500/20 mx-auto mb-3">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Free CV Scoring</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Upload your CV and check where you stand against any job description
              </p>
            </div>

            {/* Mock Interviews */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Mock Interviews</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Do multiple mock interviews and get detailed feedback
              </p>
            </div>

            {/* Job Board Access */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Job Board Access</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Access curated job opportunities matching your profile
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
