import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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

export default function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleDownloadCurriculum = () => {
    console.log('Download curriculum clicked');
  };

  const handleEnroll = () => {
    setWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection 
        onJoinWaitlist={() => setWaitlistOpen(true)} 
        onScheduleCall={() => setScheduleOpen(true)} 
      />
      
      <CareerSupportSection />
      
      <AboutSection />
      
      <CurriculumSection onDownloadCurriculum={handleDownloadCurriculum} />
      
      <WhyBcalmSection />
      
      <TestimonialsSection />
      
      <InstructorsSection />
      
      <PricingSection 
        onEnroll={handleEnroll}
        onJoinWaitlist={() => setWaitlistOpen(true)} 
      />
      
      <CTASection 
        onEnroll={handleEnroll}
        onScheduleCall={() => setScheduleOpen(true)} 
      />
      
      <Footer />
      
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      <ScheduleCallDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </div>
  );
}
