import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NavbarProps {
  onJoinWaitlist: () => void;
  onScheduleCall: () => void;
}

export default function Navbar({ onJoinWaitlist, onScheduleCall }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-foreground">
            AI PM Launchpad
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onScheduleCall}
              data-testid="button-nav-schedule"
            >
              Schedule a Call
            </Button>
            <Button 
              onClick={onJoinWaitlist}
              data-testid="button-nav-waitlist"
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
