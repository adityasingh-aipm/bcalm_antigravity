import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";
import heroBackground from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

interface HeroSectionProps {
  onJoinWaitlist: () => void;
  onScheduleCall: () => void;
}

export default function HeroSection({ onJoinWaitlist, onScheduleCall }: HeroSectionProps) {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 19, 43, 0.85), rgba(11, 19, 43, 0.90)), url(${heroBackground})`,
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
                AI Product roles
              </span>{" "}
              in{" "}
              <span className="font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                30 days
              </span>
            </h1>
          </div>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4 md:mb-5">
            Designed for non-tech students & recent graduates
          </p>
          
          {/* Primary CTA - Full width on mobile */}
          <div className="md:max-w-md md:mx-auto mb-3 md:mb-4">
            <Button 
              size="lg" 
              className="w-screen -ml-4 md:w-full md:ml-0 text-base rounded-none md:rounded-lg"
              onClick={() => window.open('https://wa.me/919398354912?text=Hi%2C%20I%27m%20interested%20in%20the%20AI%20PM%20Launchpad%20program', '_blank')}
              data-testid="button-contact-whatsapp"
            >
              <SiWhatsapp className="mr-2 h-5 w-5" />
              Contact on WhatsApp
            </Button>
          </div>

          {/* Social Proof - Light styling, after CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-2 md:mb-3"
          >
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="h-4 w-4 flex-shrink-0 text-white/60" />
              <p className="text-xs sm:text-sm text-white/70">
                Trusted by <span className="font-semibold text-white/90">200+ students</span> from IITs, BITS, NITs & IIITs
              </p>
            </div>
          </motion.div>

          {/* Cohort Info - Simple text line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-2 md:mb-3"
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-white/60" />
              <p className="text-xs sm:text-sm text-white/70">
                Next cohort starts: <span className="font-medium text-white/90">December 2, 2025</span>
              </p>
            </div>
          </motion.div>

          {/* Secondary Actions - Inline links, very light */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8 md:mb-10"
          >
            <p className="text-sm text-white/60">
              <button
                onClick={onScheduleCall}
                className="hover:text-white/80 transition-colors underline-offset-4 hover:underline"
                data-testid="button-schedule-call"
              >
                Schedule a call
              </button>
              <span className="mx-2">·</span>
              <a
                href="/ai-pm-readiness"
                className="hover:text-white/80 transition-colors underline-offset-4 hover:underline"
                data-testid="link-readiness-check"
              >
                Take the AI PM Readiness Check →
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
