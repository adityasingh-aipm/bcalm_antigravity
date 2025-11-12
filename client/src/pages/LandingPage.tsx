import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CurriculumSection from "@/components/CurriculumSection";
import WhyProgramSection from "@/components/WhyProgramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstructorsSection from "@/components/InstructorsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";
import ScheduleCallDialog from "@/components/ScheduleCallDialog";

export default function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const handleDownloadCurriculum = () => {
    console.log('Download curriculum clicked');
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onJoinWaitlist={() => setWaitlistOpen(true)} 
        onScheduleCall={() => setScheduleOpen(true)} 
      />
      
      <HeroSection 
        onJoinWaitlist={() => setWaitlistOpen(true)} 
        onScheduleCall={() => setScheduleOpen(true)} 
      />
      
      <AboutSection />
      
      <CurriculumSection onDownloadCurriculum={handleDownloadCurriculum} />
      
      <WhyProgramSection />
      
      <TestimonialsSection />
      
      <InstructorsSection />
      
      <CTASection 
        onJoinWaitlist={() => setWaitlistOpen(true)} 
        onScheduleCall={() => setScheduleOpen(true)} 
      />
      
      <Footer />
      
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      <ScheduleCallDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </div>
  );
}
