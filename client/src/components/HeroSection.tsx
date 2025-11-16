import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Rocket, User, Target } from "lucide-react";
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
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
            className="flex flex-wrap gap-3 justify-center items-center mb-8"
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
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Badge variant="secondary" className="bg-white/15 backdrop-blur-md text-white border-white/20 px-4 py-2 text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              200+ students from IITs, BITS, NITs, and IIITs already registered!
            </Badge>
            <Badge variant="secondary" className="bg-white/15 backdrop-blur-md text-white border-white/20 px-4 py-2 text-sm flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Next Cohort Starts: December 2, 2025
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
