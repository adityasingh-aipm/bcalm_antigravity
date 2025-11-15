import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Rocket, Award, Zap, Users } from "lucide-react";
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 19, 43, 0.85), rgba(11, 19, 43, 0.90)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-20 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight">
            Become Interview-Ready for
            <br />
            <span className="font-bold bg-gradient-to-r from-primary via-primary to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(106,61,240,0.5)]">
              AI Product
            </span>{" "}
            Roles in Just{" "}
            <span className="font-bold bg-gradient-to-r from-primary via-primary to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(106,61,240,0.5)]">
              30 Days
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Designed for Non-Tech Students & Graduates
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              size="lg" 
              className="text-base px-8 py-6 bg-gradient-to-r from-primary to-primary/90"
              onClick={onJoinWaitlist}
              data-testid="button-join-waitlist"
            >
              Join the Waitlist
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
              onClick={onScheduleCall}
              data-testid="button-schedule-call"
            >
              Schedule a Call
            </Button>
          </div>

          {/* Why Choose This Program Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 text-center">
              Why Choose This Program
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {/* Card 1: Expert Instructor */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 hover-elevate transition-all duration-300"
                data-testid="card-why-choose-expert"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30">
                    <Award className="h-6 w-6 text-amber-300" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-3">
                    Learn From the Leader Behind 500+ PM Interviews
                  </h4>
                  <p className="text-sm text-white/85 leading-relaxed">
                    Get trained by a Product Leader who has conducted{" "}
                    <span className="font-semibold text-white">500+ PM interviews</span> and shaped the decisions behind{" "}
                    <span className="font-semibold text-white">30–40 PM offers</span>.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: 10x Results */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 hover-elevate transition-all duration-300"
                data-testid="card-why-choose-results"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-400/30">
                    <Zap className="h-6 w-6 text-violet-300" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-3">
                    10x Your Shortlist Chances
                  </h4>
                  <p className="text-sm text-white/85 leading-relaxed">
                    Use{" "}
                    <span className="font-semibold text-white">insider hiring criteria</span> to craft a resume and{" "}
                    <span className="font-semibold text-white">AI PM portfolio</span> that gets you{" "}
                    <span className="font-semibold text-white">10x more shortlists</span> than typical applicants.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Small Cohort */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 hover-elevate transition-all duration-300"
                data-testid="card-why-choose-cohort"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30">
                    <Users className="h-6 w-6 text-emerald-300" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-3">
                    Selective, High-Quality Cohort
                  </h4>
                  <p className="text-sm text-white/85 leading-relaxed">
                    We{" "}
                    <span className="font-semibold text-white">handpick a limited cohort</span> so every student gets{" "}
                    <span className="font-semibold text-white">personal attention</span>, deeper mentorship, and a{" "}
                    <span className="font-semibold text-white">high-caliber peer group</span>.
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
