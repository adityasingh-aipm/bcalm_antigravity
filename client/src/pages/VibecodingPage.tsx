import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Code, Users, Zap, CheckCircle2, ArrowRight, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import VibecodingEnrollmentModal from "@/components/VibecodingEnrollmentModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function VibecodingPage() {
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);

  const benefits = [
    {
      icon: Code,
      title: "Learn by Vibecoding Projects",
      description: "Build real projects from day 1, not just theory. Learn by doing with hands-on challenges.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Mentorship",
      description: "Get personalized guidance and instant feedback on your code from AI mentors.",
    },
    {
      icon: Users,
      title: "Build a Portfolio in 14 Days",
      description: "Create 4+ production-ready projects to showcase to employers.",
    },
  ];

  const curriculum = [
    { day: "Days 1-2", title: "HTML & CSS Fundamentals", projects: "Portfolio Setup" },
    { day: "Days 3-4", title: "JavaScript Basics", projects: "Interactive Webpage" },
    { day: "Days 5-6", title: "React Intro", projects: "Todo App" },
    { day: "Days 7-8", title: "Backend with Node.js", projects: "API Server" },
    { day: "Days 9-10", title: "Database Integration", projects: "Full-Stack Todo" },
    { day: "Days 11-12", title: "Deployment & DevOps", projects: "Deploy Live" },
    { day: "Days 13-14", title: "Capstone Project", projects: "Your Own Idea" },
  ];

  const instructors = [
    {
      name: "Rakesh Malloju",
      role: "Senior Director of Product",
      companies: ["Zaptic", "Musigma"],
      education: "IIM Calcutta",
      linkedin: "https://linkedin.com/in/rakesh-malloju",
    },
    {
      name: "Aditya Singh",
      role: "Product Manager",
      companies: ["Apollo247"],
      education: "IIT Delhi",
      linkedin: "https://linkedin.com/in/aditya-singh",
    },
    {
      name: "Akhil Joy",
      role: "Senior Product Engineer",
      companies: ["Swiggy", "Flipkart"],
      education: "NIT Trichy",
      linkedin: "https://linkedin.com/in/akhil-joy",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Flipkart",
      text: "Vibecoding made me confident to build full-stack apps. Got my first job offer within a month!",
      avatar: "PS",
    },
    {
      name: "Arjun Patel",
      role: "Freelance Developer",
      text: "The 14-day structure is perfect. Went from zero coding to building client projects.",
      avatar: "AP",
    },
    {
      name: "Neha Gupta",
      role: "Product Manager, Amazon",
      text: "Great for understanding tech fundamentals. Every product manager should do this!",
      avatar: "NG",
    },
  ];

  const projects = [
    {
      title: "Personal Portfolio",
      description: "A stunning portfolio site to showcase your skills",
      tech: "HTML, CSS, JavaScript",
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack shopping app with payment integration",
      tech: "React, Node.js, MongoDB",
    },
    {
      title: "AI Chat Application",
      description: "Real-time chat app with AI responses",
      tech: "React, WebSockets, Python",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] via-[#2a1100] to-[#1a0000]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#1a0000]/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Vibecoding</span>
          </div>
          <Button
            size="sm"
            onClick={() => setEnrollmentModalOpen(true)}
            className="font-semibold"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFA500 100%)",
              border: "1px solid rgba(255, 107, 53, 0.3)",
            }}
            data-testid="button-enroll-nav"
          >
            Enroll Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-6 md:pt-40 md:pb-8 px-4 overflow-hidden">
        {/* Hero gradient background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center top, rgba(255, 107, 53, 0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">New Batch Starting Now</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Learn to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Websites & Apps</span> in 14 Days
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/70 mb-2">
            Master full-stack web dev through vibecoded, hands-on projects.
          </motion.p>

          <motion.p variants={itemVariants} className="text-base text-white/50 mb-8">
            No prior coding experience needed.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setEnrollmentModalOpen(true)}
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFA500 100%)",
                border: "1px solid rgba(255, 107, 53, 0.3)",
              }}
              data-testid="button-enroll-hero"
            >
              Enroll Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Vibecoding Works */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why Vibecoding Works
          </motion.h2>
          <motion.p variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            Proven methods backed by 1000+ successful graduates
          </motion.p>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="bg-white/5 border-white/10 hover:border-orange-500/30 transition-all hover:bg-orange-500/5">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-orange-400" />
                      </div>
                      <CardTitle className="text-white">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Built by Leaders Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Built by Leaders Who've Hired 1000+
          </motion.h2>
          <motion.p variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            From IITs to top tech companies — they know what it takes to get hired
          </motion.p>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 flex-shrink-0 border-4 border-orange-500/30">
                  <span className="text-4xl font-bold text-white">{instructor.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                    <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-white/70 mb-2">{instructor.role}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                    {instructor.companies.map((company) => (
                      <span key={company} className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                        {company}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/50">{instructor.education}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            14-Day Curriculum
          </motion.h2>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {curriculum.map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-orange-500/10 transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-orange-300 font-semibold">{item.day}</p>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-sm text-white/60 mt-1">Build: {item.projects}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Success Stories
          </motion.h2>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-orange-400 text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What You Will Build */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            What You Will Build
          </motion.h2>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-orange-500/20 hover:border-orange-500/50 transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                      <Zap className="h-6 w-6 text-orange-400" />
                    </div>
                    <CardTitle className="text-white">{project.title}</CardTitle>
                    <CardDescription className="text-white/60">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.split(", ").map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(247, 147, 30, 0.1) 50%, rgba(255, 165, 0, 0.15) 100%)",
            }}
          />
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your First Website or App?
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-white/70 mb-8">
            Join 1000+ developers who launched their careers with Vibecoding
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              onClick={() => setEnrollmentModalOpen(true)}
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFA500 100%)",
                border: "1px solid rgba(255, 107, 53, 0.3)",
              }}
              data-testid="button-enroll-final-cta"
            >
              Enroll Now - Limited Spots
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center text-white/60 text-sm">
          <p>&copy; 2025 Vibecoding. All rights reserved. | Part of BCALM ecosystem</p>
        </div>
      </footer>

      {/* Enrollment Modal */}
      <VibecodingEnrollmentModal open={enrollmentModalOpen} onOpenChange={setEnrollmentModalOpen} />
    </div>
  );
}
