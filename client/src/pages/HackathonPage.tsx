import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Lightbulb, Trophy, Rocket, CheckCircle, Send, Clock, Users, Briefcase, ArrowRight, MessageCircle, Linkedin, Twitter, Instagram, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import bcalmLogo from "@assets/587825421_122110881585061636_4522478478515908937_n_1763885253278.jpg";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  email: z.string().email("Invalid email").refine((e) => e.endsWith("@gmail.com"), "Please use a Gmail address"),
  companyOrCollege: z.string().min(2, "Company/College name is required"),
  agreeToUpdates: z.boolean().default(true),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const features = [
  {
    icon: Lightbulb,
    title: "Solve Real Product Challenges",
    description: "Apply AI and strategic thinking to real-world problems. No generic assignments—real scenarios from actual product teams.",
  },
  {
    icon: Trophy,
    title: "Winners Get Direct Referrals",
    description: "Top performers get job referrals to companies actively hiring Product Managers, with interviews conducted by hiring managers who've hired 200+ PMs.",
  },
  {
    icon: Rocket,
    title: "Free Premium Course Access",
    description: "Win and unlock lifetime access to Bcalm's premium AI Product Manager course (normally paid). Learn from someone who's been on both sides of the hiring table.",
  },
];

const steps = [
  { step: 1, title: "Register", description: "Join via OTP verification (instant)" },
  { step: 2, title: "Receive Challenge", description: "Saturday morning, you get the real product challenge" },
  { step: 3, title: "Build & Solve", description: "4 hours to think, analyze, and present your solution" },
  { step: 4, title: "Win & Connect", description: "Top 3 get direct referrals + free course access" },
];

const reasons = [
  {
    title: "Direct Access to Hiring Managers",
    description: "Not recruiters. Actual people making PM hiring decisions. They see your strategic thinking in real-time.",
  },
  {
    title: "Prove PM Skills Without Experience",
    description: "You don't need years in the role. Show product thinking, data analysis, and AI fluency. That's what matters.",
  },
  {
    title: "Two Prizes That Actually Matter",
    description: "A job referral is worth 10x more than a certificate. Free course access teaches you what hiring managers actually look for.",
  },
];

const testimonials = [
  {
    background: "Final Year Student, BITS Pilani",
    outcome: "Got PM interview at Flipkart → Used Bcalm premium course to prep → Offer received",
  },
  {
    background: "Data Analyst, 2 years exp, Tech Company",
    outcome: "Placed Top 3 in hackathon → Job referral led to PM role at Amazon → Now taking Bcalm for deeper PM skills",
  },
  {
    background: "Business Analyst, EdTech startup",
    outcome: "Won hackathon → Direct referral to Myntra's PM team → Interview scheduled this month",
  },
];

const faqs = [
  {
    question: "Do I need PM experience to participate?",
    answer: "No. We're looking for strategic thinking and creativity. You'll be surprised what data analysts and BAs can do.",
  },
  {
    question: "How are winners judged?",
    answer: "Framework clarity, AI application, business impact, and presentation. The person leading it has hired 200+ PMs—they know what matters.",
  },
  {
    question: "What happens after I register?",
    answer: "We'll send you the challenge details on Friday. Saturday 10 AM IST, the hackathon starts. 4 hours to submit your solution.",
  },
  {
    question: "Is this online?",
    answer: "Yes, completely online. Work from anywhere. Submission is a document (PDF/Google Doc) + 5-min video walkthrough.",
  },
  {
    question: "How will I know if I won?",
    answer: "Results announced within 48 hours. Winners contacted directly via email and phone.",
  },
  {
    question: "Can I form a team?",
    answer: "For now, individual submissions only.",
  },
];

function getNextSaturdayCountdown(): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(10, 0, 0, 0);
  
  const diff = nextSaturday.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

export default function HackathonPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [location]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(getNextSaturdayCountdown());
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      companyOrCollege: "",
      agreeToUpdates: true,
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getNextSaturdayCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const utmSource = searchParams.get("utm_source") || undefined;
      const utmMedium = searchParams.get("utm_medium") || undefined;
      const utmCampaign = searchParams.get("utm_campaign") || undefined;
      
      const response = await apiRequest("POST", "/api/hackathon/register", {
        ...data,
        utmSource,
        utmMedium,
        utmCampaign,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRegistrationId(data.id);
      setShowOtpModal(true);
      setResendCooldown(30);
      toast({
        title: "OTP Sent!",
        description: "Check your phone for the verification code.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await apiRequest("POST", "/api/hackathon/verify", {
        registrationId,
        otp,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsVerified(true);
      setShowOtpModal(false);
      toast({
        title: "Registration Complete!",
        description: "You're all set for the hackathon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      setOtpValue("");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hackathon/resend-otp", {
        registrationId,
      });
      return response.json();
    },
    onSuccess: () => {
      setResendCooldown(30);
      toast({
        title: "OTP Resent",
        description: "Check your phone for the new code.",
      });
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    registerMutation.mutate(data);
  };

  const handleVerifyOtp = () => {
    if (otpValue.length === 6) {
      verifyMutation.mutate(otpValue);
    }
  };

  const scrollToRegistration = () => {
    document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/919876543210?text=Hi, I have a question about the Bcalm Hackathon", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <img src={bcalmLogo} alt="Bcalm" className="h-10" data-testid="img-logo" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">Home</Link>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-hackathons">Hackathons</a>
            <a href="#why-join" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-why-bcalm">Why Bcalm?</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">Contact</a>
          </div>
          <Button onClick={scrollToRegistration} className="bg-violet-600 hover:bg-violet-700" data-testid="button-register-nav">
            Register Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-pink-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="text-hero-headline">
              Think Beyond Data and Analysis
            </h1>
            <p className="text-xl md:text-2xl text-violet-600 font-semibold mb-6" data-testid="text-hero-subheadline">
              Turn Your 10x Ideas Into 10x Careers
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-body">
              You analyze data. You find patterns. But can you build products that matter? In this 4-hour hackathon, you'll solve real product challenges using AI—and we'll connect winners directly with hiring managers at top companies. This isn't about coding. It's about product thinking.
            </p>
            <Button 
              size="lg" 
              onClick={scrollToRegistration}
              className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white px-8 py-6 text-lg"
              data-testid="button-register-hero"
            >
              Register for This Saturday's Hackathon
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-testid="text-features-headline">
            4 Hours. Real Problems. Real Opportunities.
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            What makes this hackathon different from the rest
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-timeline-headline">
            Here's Your Path to Winning
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-violet-200 dark:bg-violet-800 transform md:-translate-x-1/2" />
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-4 mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  data-testid={`timeline-step-${index}`}
                >
                  <div className="flex-1 hidden md:block" />
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm transform md:-translate-x-1/2 z-10">
                    {step.step}
                  </div>
                  <div className="flex-1 ml-16 md:ml-0">
                    <Card className="p-4">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-why-headline">
            Why Should You Compete?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-l-4 border-l-violet-500" data-testid={`card-reason-${index}`}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                    <p className="text-muted-foreground">{reason.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-testimonials-headline">
            See What Winners Achieved
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/20 dark:to-pink-950/20" data-testid={`card-testimonial-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-4 w-4 text-violet-600" />
                      <span className="text-sm font-medium text-violet-600">{testimonial.background}</span>
                    </div>
                    <p className="text-foreground font-medium">{testimonial.outcome}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-gradient-to-br from-violet-600 to-pink-500">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {!isVerified ? (
              <Card className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" data-testid="text-registration-headline">
                  You're 2 Minutes Away From Competing
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  Register now. Next hackathon is this Saturday.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} data-testid="input-fullname" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <span className="flex items-center px-3 bg-muted rounded-md text-sm">+91</span>
                              <Input placeholder="10-digit phone number" {...field} data-testid="input-phone" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gmail Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@gmail.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyOrCollege"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / College Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company or college" {...field} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-violet-600 hover:bg-violet-700"
                      disabled={registerMutation.isPending}
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending ? "Sending OTP..." : "Get OTP & Register"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-success-title">You're Registered!</h2>
                <p className="text-muted-foreground mb-6">
                  Check your email for next steps. Challenge details will be sent this Friday.
                </p>
                
                <div className="bg-muted rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Next hackathon starts in:</p>
                  <div className="flex justify-center gap-4" data-testid="countdown-timer">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-600">{countdown.days}</div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-600">{countdown.hours}</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-600">{countdown.minutes}</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-600">{countdown.seconds}</div>
                      <div className="text-xs text-muted-foreground">Seconds</div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => window.open("https://linkedin.com/share", "_blank")} variant="outline" data-testid="button-share-linkedin">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-faq-headline">
            Questions? We've Got Answers
          </h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} data-testid={`accordion-faq-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link href="/">
                <img src={bcalmLogo} alt="Bcalm" className="h-10" />
              </Link>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy</Link>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms</a>
                <a href="mailto:support@bcalm.org" className="hover:text-foreground transition-colors" data-testid="link-contact-email">Contact</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={openWhatsApp} data-testid="button-whatsapp">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild data-testid="button-linkedin">
                <a href="https://linkedin.com/company/bcalm" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild data-testid="button-twitter">
                <a href="https://twitter.com/bcalm" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild data-testid="button-instagram">
                <a href="https://instagram.com/bcalm" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} Bcalm. All rights reserved.
          </div>
        </div>
      </footer>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Phone</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit code to your phone. Enter it below to complete registration.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
              data-testid="input-otp"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            
            <Button 
              onClick={handleVerifyOtp}
              disabled={otpValue.length !== 6 || verifyMutation.isPending}
              className="w-full"
              data-testid="button-verify-otp"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify & Complete Registration"}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => resendMutation.mutate()}
              disabled={resendCooldown > 0 || resendMutation.isPending}
              className="text-sm"
              data-testid="button-resend-otp"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
