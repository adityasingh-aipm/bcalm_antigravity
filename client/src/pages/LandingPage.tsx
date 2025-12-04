import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyBcalmWorksSection from "@/components/WhyBcalmWorksSection";
import StickyQuicklinks from "@/components/StickyQuicklinks";
import CareerSupportSection from "@/components/CareerSupportSection";
import AboutSection from "@/components/AboutSection";
import CurriculumSection from "@/components/CurriculumSection";
import WhyBcalmSection from "@/components/WhyBcalmSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstructorsSection from "@/components/InstructorsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";
import ScheduleCallDialog from "@/components/ScheduleCallDialog";
import { trackPageView } from "@/lib/analytics";

export default function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    trackPageView();
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleDownloadCurriculum = () => {
    // Curriculum download handler
  };

  const handleEnroll = () => {
    setWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Fold 1 - Hero with 2-step CTA */}
      <HeroSection />
      
      {/* Instructors Section - Above Why Bcalm Works */}
      <InstructorsSection />
      
      {/* Fold 2 - Why Bcalm Works (Proof) */}
      <WhyBcalmWorksSection />
      
      {/* Fold 3 - Sticky Quicklinks */}
      <StickyQuicklinks />
      
      <CareerSupportSection />
      
      <AboutSection />
      
      <CurriculumSection onDownloadCurriculum={handleDownloadCurriculum} />
      
      <WhyBcalmSection />
      
      <TestimonialsSection />
      
      <PricingSection 
        onEnroll={handleEnroll}
        onJoinWaitlist={() => setWaitlistOpen(true)} 
      />
      
      <CTASection 
        onEnroll={handleEnroll}
        onScheduleCall={() => setScheduleOpen(true)} 
      />
      
      <Footer />
      
      {/* Dialogs */}
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      <ScheduleCallDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </div>
  );
}
