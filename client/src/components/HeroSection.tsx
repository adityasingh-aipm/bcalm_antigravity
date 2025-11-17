import { Button } from "@/components/ui/button";
import { User, Target } from "lucide-react";
import { motion } from "framer-motion";
import heroBackground from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

interface HeroSectionProps {
  onJoinWaitlist: () => void;
  onScheduleCall: () => void;
}

const quickLinks = [
  { name: "Career Support", href: "#career-support" },
  { name: "About", href: "#about" },
  { name: "Curriculum", href: "#curriculum" },
  { name: "Why Bcalm", href: "#why-bcalm" },
  { name: "Reviews", href: "#reviews" },
  { name: "Instructors", href: "#instructors" },
  { name: "Pricing", href: "#pricing" },
];

export default function HeroSection({ onJoinWaitlist, onScheduleCall }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 19, 43, 0.85), rgba(11, 19, 43, 0.90)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-20" style={{ maxWidth: '1080px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight">
            Become Interview-ready for{" "}
            <span className="font-bold bg-gradient-to-r from-primary via-primary to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(106,61,240,0.5)]">
              AI Product
            </span>{" "}
            in{" "}
            <span className="font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
              30 Days
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Designed for Non-Tech Students & Graduates
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="text-base"
              onClick={onJoinWaitlist}
              data-testid="button-join-waitlist"
            >
              Join the Waitlist
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base bg-white/10 backdrop-blur-md border-white/30 text-white"
              onClick={onScheduleCall}
              data-testid="button-schedule-call"
            >
              Schedule a Call
            </Button>
          </div>

          {/* Social Proof Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-3"
          >
            <div
              className="mx-auto px-4 py-2.5 text-center"
              style={{
                maxWidth: '600px',
                background: 'rgba(131, 88, 255, 0.08)',
                borderRadius: '9999px',
                backdropFilter: 'blur(10px)'
              }}
              data-testid="pill-social-proof"
            >
              <p className="text-sm leading-relaxed" style={{ color: '#111111' }}>
                🧑‍🎓 Trusted by <span className="font-semibold">200+</span> students from IITs, BITS, NITs, and IIITs
              </p>
            </div>
          </motion.div>

          {/* Next Cohort Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div
              className="mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
              style={{
                maxWidth: '600px',
                background: '#111827',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
              data-testid="card-cohort-highlight"
            >
              <div className="flex-shrink-0 text-2xl">📅</div>
              <div className="flex-1 text-center sm:text-left">
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  Next Cohort
                </p>
                <p
                  className="text-base sm:text-lg font-semibold mb-1"
                  style={{ color: '#ffffff' }}
                >
                  Starts: December 2, 2025
                </p>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Limited seats • Applications reviewed on a rolling basis
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why Bcalm Works Section - Premium Redesign */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginTop: '56px' }}
          >
            {/* Section Heading & Subtitle */}
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-[28px] font-semibold text-white mb-3">
                Why Bcalm Works
              </h3>
              <p className="text-sm md:text-base" style={{ color: '#d0d0d0' }}>
                Built from real hiring experience, real product journeys, and real outcomes.
              </p>
            </div>
            
            {/* Cards Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-[1080px] mx-auto" style={{ marginTop: '28px' }}>
              {/* Card 1: Learn From a Product Leader */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl"
                style={{
                  background: '#f8f7ff',
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  padding: '24px 28px'
                }}
                data-testid="card-instructor"
              >
                {/* Icon */}
                <div className="mb-3">
                  <User className="w-6 h-6" style={{ color: '#6c47ff' }} />
                </div>
                
                {/* Title */}
                <h4 className="text-lg md:text-xl font-semibold mb-4" style={{ color: '#111111' }}>
                  Learn From a Product Leader
                </h4>
                
                {/* Bullets */}
                <div className="space-y-3">
                  <p className="text-sm md:text-[15px]" style={{ color: '#333333', lineHeight: '1.5' }}>
                    • Built large-scale products across Zepto, Apollo247, Toppr & Housing.com
                  </p>
                  <p className="text-sm md:text-[15px]" style={{ color: '#333333', lineHeight: '1.5' }}>
                    • Grew income from ₹3 LPA to ₹2 Cr+ in 10 years
                  </p>
                  <p className="text-sm md:text-[15px]" style={{ color: '#333333', lineHeight: '1.5' }}>
                    • Currently Senior Director of Product at Zepto, a YC-backed $7B company
                  </p>
                </div>
              </motion.div>

              {/* Card 2: 10x Your Shortlist Chances */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-2xl"
                style={{
                  background: '#f8f7ff',
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  padding: '24px 28px'
                }}
                data-testid="card-shortlist"
              >
                {/* Icon */}
                <div className="mb-3">
                  <Target className="w-6 h-6" style={{ color: '#6c47ff' }} />
                </div>
                
                {/* Title */}
                <h4 className="text-lg md:text-xl font-semibold mb-4" style={{ color: '#111111' }}>
                  10x Your Shortlist Chances
                </h4>
                
                {/* Bullets */}
                <div className="space-y-3">
                  <p className="text-sm md:text-[15px]" style={{ color: '#333333', lineHeight: '1.5' }}>
                    • Insider hiring signals most candidates never learn
                  </p>
                  <p className="text-sm md:text-[15px]" style={{ color: '#333333', lineHeight: '1.5' }}>
                    • A Portfolio That Proves You Can Solve Real Product Problems
                  </p>
                  <p className="text-sm md:text-[15px]" style={{ color: '#333333', lineHeight: '1.5' }}>
                    • A Resume Engineered to Outperform 90% of Applicants
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-3 justify-center items-center"
            style={{ marginTop: '56px' }}
          >
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors border-b border-transparent hover:border-white/60 pb-1 cursor-pointer"
                data-testid={`link-quick-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
