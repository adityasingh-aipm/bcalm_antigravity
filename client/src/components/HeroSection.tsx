import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import neuralBg from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

interface HeroSectionProps {
  onOpenLeadModal: () => void;
}

export default function HeroSection({ onOpenLeadModal }: HeroSectionProps) {
  return (
    <section 
      id="hero"
      className="relative overflow-hidden" 
      style={{ paddingTop: '60px' }}
    >
      {/* Layer 1: Rich multi-stop gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #0a0014 0%, #110022 25%, #1a0033 50%, #110022 75%, #0a0014 100%)',
        }}
      />
      
      {/* Layer 2: Neural network AI background - reduced opacity */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: `url(${neuralBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Layer 3: Central spotlight glow - reduced by ~50% */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.06) 30%, transparent 70%)',
          }}
        />
        {/* Secondary glow - reduced */}
        <div 
          className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[500px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>
      
      {/* Layer 4: Edge vignette for depth */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 0, 20, 0.6) 100%)',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 pt-8 md:pt-12 pb-8 flex flex-col items-center" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center"
        >
          {/* Hero Surface Panel */}
          <div 
            className="px-6 py-6 md:px-8 md:py-7 rounded-[20px]"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Eyebrow Pill - smaller, tighter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 md:mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 50%, rgba(217, 119, 6, 0.15) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span 
                className="text-xs font-medium text-amber-200/90 tracking-wide"
                style={{ fontSize: '12px' }}
              >
                India's #1 AI Interview Prep Platform
              </span>
            </motion.div>
            
            {/* Main Headline - polished typography */}
            <h1 className="hero-title mb-3 md:mb-4">
              <span className="whitespace-nowrap">Crack Your <span className="accent">Dream Job</span></span><br />
              <span className="whitespace-nowrap">in <span className="payoff">30 Days</span></span>
            </h1>
            
            {/* Subline */}
            <p className="text-base md:text-lg text-white/70 mb-6 md:mb-7 font-medium">
              Free AI CV Score + 30-Day Personalized Plan
            </p>
            
            {/* Primary CTA Button */}
            <motion.div
              id="hero-cta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col items-center"
            >
              <Button 
                onClick={onOpenLeadModal}
                className="h-14 px-12 text-lg font-bold rounded-xl transition-all duration-[250ms] ease-out hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 25%, #7C3AED 50%, #6D28D9 75%, #5B21B6 100%)',
                  border: '1px solid rgba(196, 181, 253, 0.4)',
                  boxShadow: '0 4px 24px rgba(139, 92, 246, 0.35), 0 2px 8px rgba(139, 92, 246, 0.2)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
                data-testid="button-start-free"
              >
                Start for Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
          
          {/* Trust Section - with background strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-10 md:mt-12 -mx-6 md:-mx-8 px-6 md:px-8 py-5 md:py-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <p 
              className="font-semibold text-white/90 mb-4"
              style={{ fontSize: '14px' }}
            >
              Trusted by Students from Top Institutions
            </p>
            
            {/* College Chips - improved contrast with hover */}
            <div className="flex flex-wrap justify-center gap-2.5 md:gap-3 mb-5">
              {["IIT", "BITS", "NIT", "IIM"].map((college) => (
                <span 
                  key={college}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-[1px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {college}
                </span>
              ))}
            </div>
            
            {/* Success Stories - larger text */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2.5">
                <div 
                  className="w-9 h-9 rounded-full border-2 border-[#110022] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  }}
                >
                  A
                </div>
                <div 
                  className="w-9 h-9 rounded-full border-2 border-[#110022] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  }}
                >
                  R
                </div>
                <div 
                  className="w-9 h-9 rounded-full border-2 border-[#110022] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }}
                >
                  S
                </div>
                <div 
                  className="w-9 h-9 rounded-full border-2 border-[#110022] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                  }}
                >
                  P
                </div>
              </div>
              <div className="text-left">
                <p 
                  className="font-semibold text-white"
                  style={{ fontSize: '17px' }}
                >
                  200+ Success Stories
                </p>
                <p className="text-sm text-white/60">
                  Students placed at top companies
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
