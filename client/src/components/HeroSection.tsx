import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import heroBackground from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

interface HeroSectionProps {
  onJoinWaitlist: () => void;
  onScheduleCall: () => void;
}

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Become the Next-Gen AI Product Manager in 30 Days
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            A curated program by AI Product Managers and Leaders to help ambitious graduates build the foundation to lead in the age of intelligent products.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Badge variant="secondary" className="bg-white/15 backdrop-blur-md text-white border-white/20 px-4 py-2 text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              200+ students from IITs, BITS, and NITs already registered!
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
