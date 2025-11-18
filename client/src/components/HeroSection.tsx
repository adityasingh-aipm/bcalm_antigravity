import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, User, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import heroBackground from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

interface HeroSectionProps {
  onJoinWaitlist: () => void;
  onScheduleCall: () => void;
}

export default function HeroSection({ onJoinWaitlist, onScheduleCall }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 19, 43, 0.85), rgba(11, 19, 43, 0.90)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4" style={{ maxWidth: '1080px' }}>
        {/* FOLD 1 - HERO */}
        <div className="py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Headline with subtle glow */}
            <div className="relative mb-4">
              <div 
                className="absolute inset-0 blur-3xl opacity-30"
                style={{
                  background: 'radial-gradient(circle at center, rgba(108, 71, 255, 0.4) 0%, transparent 70%)',
                  transform: 'scale(1.2)',
                }}
              />
              <h1 
                className="relative text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight max-w-4xl mx-auto"
              >
                Become interview-ready for{" "}
                <span className="font-bold bg-gradient-to-r from-primary via-primary to-violet-400 bg-clip-text text-transparent">
                  AI Product roles
                </span>{" "}
                in{" "}
                <span className="font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  30 days
                </span>
              </h1>
            </div>
            
            {/* Subheadline */}
            <p 
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              style={{ marginBottom: '20px' }}
            >
              Designed for non-tech students & recent graduates
            </p>
            
            {/* Primary CTA */}
            <div className="mb-3">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 text-base"
                onClick={onJoinWaitlist}
                data-testid="button-join-waitlist"
              >
                Join the Waitlist
              </Button>
            </div>
            
            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(245, 243, 255, 0.15)' }}>
                <GraduationCap className="h-4 w-4 flex-shrink-0 text-white/90" />
                <p className="text-xs sm:text-sm text-white/80">
                  Trusted by <span className="font-semibold text-white">200+ students</span> from IITs, BITS, NITs & IIITs
                </p>
              </div>
            </motion.div>

            {/* Cohort Info Line */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-2"
            >
              <div className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/70" />
                <p className="text-sm text-white/70">
                  Next cohort starts: <span className="text-white/90 font-medium">December 2, 2025</span>
                </p>
              </div>
            </motion.div>

            {/* Secondary Inline Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <button
                  onClick={onScheduleCall}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  data-testid="link-schedule-call"
                >
                  Schedule a call
                </button>
                <span className="text-gray-500">·</span>
                <Link href="/ai-pm-readiness">
                  <a className="text-gray-400 hover:text-gray-300 transition-colors" data-testid="link-readiness-check">
                    Take the AI PM Readiness Check →
                  </a>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FOLD 2 - WHY BCALM WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pb-16"
        >
          {/* Section Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              Why Bcalm Works
            </h2>
            <p className="text-sm md:text-base text-gray-400">
              Built from real hiring experience, real product journeys, and real outcomes.
            </p>
          </div>
          
          {/* Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Card 1: Instructor */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="rounded-2xl p-6"
              style={{
                background: '#f8f7ff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
              data-testid="card-instructor"
            >
              <div className="mb-4">
                <User className="w-6 h-6" style={{ color: '#6c47ff' }} />
              </div>
              
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#111111' }}>
                Learn from a Product Leader
              </h3>
              
              <ul className="space-y-3" style={{ color: '#4a5568' }}>
                <li className="text-sm md:text-base flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Built large-scale products at Zepto, Apollo 247, Toppr & Housing.com</span>
                </li>
                <li className="text-sm md:text-base flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Grew his career from ₹3.2 LPA → ₹2.4 Cr PA</span>
                </li>
                <li className="text-sm md:text-base flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Senior Director of Product at a $7B YC-backed company</span>
                </li>
              </ul>
            </motion.div>

            {/* Card 2: Shortlist */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="rounded-2xl p-6"
              style={{
                background: '#f8f7ff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
              data-testid="card-shortlist"
            >
              <div className="mb-4">
                <Target className="w-6 h-6" style={{ color: '#6c47ff' }} />
              </div>
              
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#111111' }}>
                10x Your Shortlist Chances
              </h3>
              
              <ul className="space-y-3" style={{ color: '#4a5568' }}>
                <li className="text-sm md:text-base flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Learn how to craft a resume tailored for AI/PM roles, not generic applications</span>
                </li>
                <li className="text-sm md:text-base flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Build a portfolio that proves you can solve real product problems</span>
                </li>
                <li className="text-sm md:text-base flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Use insider hiring signals most candidates never see to stand out in shortlisting</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* FOLD 3 - QUICKLINKS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center items-center border-t border-white/10 pt-6">
            <a href="#curriculum" className="text-sm text-white/70 hover:text-white transition-colors" data-testid="link-quick-curriculum">Curriculum</a>
            <span className="text-white/30">·</span>
            <a href="#instructors" className="text-sm text-white/70 hover:text-white transition-colors" data-testid="link-quick-instructor">Instructor</a>
            <span className="text-white/30">·</span>
            <a href="#career-support" className="text-sm text-white/70 hover:text-white transition-colors" data-testid="link-quick-outcomes">Outcomes</a>
            <span className="text-white/30">·</span>
            <a href="#reviews" className="text-sm text-white/70 hover:text-white transition-colors" data-testid="link-quick-reviews">Reviews</a>
            <span className="text-white/30">·</span>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors" data-testid="link-quick-pricing">Pricing</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
