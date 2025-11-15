import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Rocket } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { motion } from "framer-motion";
import heroBackground from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";
import instructorPhoto from "@assets/generated_images/Professional_instructor_portrait_photo_dbebf830.png";
import offerLetter1 from "@assets/generated_images/Offer_letter_₹3.2L_thumbnail_b5356143.png";
import offerLetter2 from "@assets/generated_images/Offer_letter_₹15L_thumbnail_6ded10e1.png";
import offerLetter3 from "@assets/generated_images/Offer_letter_₹45L_thumbnail_2105022e.png";
import offerLetter4 from "@assets/generated_images/Offer_letter_₹1Cr_thumbnail_e0fc7401.png";
import offerLetter5 from "@assets/generated_images/Offer_letter_₹2.4Cr_thumbnail_275967fb.png";

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

          {/* Why Choose This Program Section - Apple-style Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h3 className="text-xl md:text-2xl font-light text-white/95 mb-8 text-center">
              Why Choose This Program
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Card 1: Instructor Card - Apple Style */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                data-testid="card-instructor"
              >
                <div className="p-8 md:p-10">
                  {/* Title */}
                  <h4 className="text-xl md:text-2xl font-light text-gray-900 mb-8 text-center leading-tight">
                    Learn From a Product Leader Who Turned ₹3.2L Into ₹2.4Cr
                  </h4>
                  
                  {/* Instructor Photo */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <img 
                        src={instructorPhoto} 
                        alt="Instructor Portrait" 
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-md"
                        data-testid="img-instructor-photo"
                      />
                    </div>
                  </div>
                  
                  {/* Bullet Points */}
                  <div className="space-y-6">
                    {/* Bullet 1: LinkedIn */}
                    <div>
                      <p className="text-base text-gray-700 mb-2">
                        • A LinkedIn Presence Built on Clarity and Trust
                      </p>
                      <a 
                        href="https://www.linkedin.com/in/rakesh-malloju-b648ab92/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        data-testid="link-instructor-linkedin"
                      >
                        <SiLinkedin className="h-4 w-4" />
                        <span className="border-b border-blue-600/30 hover:border-blue-700">View LinkedIn Profile</span>
                      </a>
                    </div>
                    
                    {/* Bullet 2: Career Transformation */}
                    <div>
                      <p className="text-base text-gray-700 mb-4">
                        • A Career Transformation Driven by a Repeatable System
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="relative group" data-testid="offer-letter-1">
                          <img 
                            src={offerLetter1} 
                            alt="₹3.2L Offer" 
                            className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow"
                          />
                          <div className="text-xs text-center mt-1 text-gray-600 font-medium">₹3.2L</div>
                        </div>
                        <div className="relative group" data-testid="offer-letter-2">
                          <img 
                            src={offerLetter2} 
                            alt="₹15L Offer" 
                            className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow"
                          />
                          <div className="text-xs text-center mt-1 text-gray-600 font-medium">₹15L</div>
                        </div>
                        <div className="relative group" data-testid="offer-letter-3">
                          <img 
                            src={offerLetter3} 
                            alt="₹45L Offer" 
                            className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow"
                          />
                          <div className="text-xs text-center mt-1 text-gray-600 font-medium">₹45L</div>
                        </div>
                        <div className="relative group" data-testid="offer-letter-4">
                          <img 
                            src={offerLetter4} 
                            alt="₹1Cr Offer" 
                            className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow"
                          />
                          <div className="text-xs text-center mt-1 text-gray-600 font-medium">₹1Cr</div>
                        </div>
                        <div className="relative group" data-testid="offer-letter-5">
                          <img 
                            src={offerLetter5} 
                            alt="₹2.4Cr Offer" 
                            className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow"
                          />
                          <div className="text-xs text-center mt-1 text-gray-600 font-medium">₹2.4Cr</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bullet 3: Senior Director */}
                    <div>
                      <p className="text-base text-gray-700">
                        • Senior Director at a $7B YC Company
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Shortlist Card - Apple Style */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                data-testid="card-shortlist"
              >
                <div className="p-8 md:p-10 h-full flex flex-col justify-center">
                  {/* Title */}
                  <h4 className="text-xl md:text-2xl font-light text-gray-900 mb-10 text-center leading-tight">
                    10x Your Shortlist Chances
                  </h4>
                  
                  {/* Bullet Points */}
                  <div className="space-y-6">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      • Insider Hiring Signals Most Candidates Never Learn
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      • A Portfolio That Proves You Can Solve Real Product Problems
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      • A Resume Engineered to Outperform 90% of Applicants
                    </p>
                  </div>
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
