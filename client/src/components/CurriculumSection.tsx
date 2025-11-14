import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const weeks = [
  {
    week: "Week 1",
    title: "AI & Product Foundations",
    whatYouLearn: [
      "Modern AI PM role across B2B/B2C",
      "Product lifecycle: Discovery → Delivery → Iteration",
      "Core PM frameworks: CIRCLES, JTBD, PR/FAQ",
      "AI fundamentals: prompts, inputs/outputs, evaluation",
      "How PMs work with AI engineers, designers, and data teams"
    ],
    outcome: "Understand how AI-first products are conceptualized, designed, and launched.",
    assignment: "Redesign one existing product feature using AI. Create a brief PR/FAQ + user journey flow."
  },
  {
    week: "Week 2",
    title: "AI Systems, Data & UX for PMs",
    whatYouLearn: [
      "AI/ML systems explained for PMs",
      "Prompt engineering fundamentals",
      "Tools: ChatGPT, NotebookLM, Gemini, Kraftful",
      "UX fundamentals for AI: feedback loops, trust, failure states",
      "How to spec AI features clearly"
    ],
    outcome: "Design clear, intuitive AI workflows and write strong prompt + UX specs.",
    assignment: "Design an AI assistant for a specific user segment. Provide flows, prompts, and a mini-spec of model behavior."
  },
  {
    week: "Week 3",
    title: "Strategy, Metrics & Business Thinking",
    whatYouLearn: [
      "Prioritization frameworks for AI products",
      "Defining AI product metrics (quality, engagement, success)",
      "Growth loops & monetization for AI-first products",
      "Competitive analysis & evaluating AI markets",
      "Responsible AI considerations (ethics, bias, safety)"
    ],
    outcome: "Think strategically like a PM — justify decisions using metrics and user impact.",
    assignment: "Write a 2–3 month product strategy for an AI feature or product. Include metrics, prioritization, and roadmap."
  },
  {
    week: "Week 4",
    title: "Capstone, Portfolio & Interview Readiness",
    whatYouLearn: [
      "Choosing a strong capstone problem",
      "Creating a complete AI PM case study",
      "Storytelling for PM interviews",
      "Product sense, execution, AI, and strategy interview patterns",
      "Formatting a professional PM portfolio"
    ],
    outcome: "Graduate with a polished AI Product Case Study + a PM-ready portfolio.",
    assignment: "Build your complete capstone project with PRD sections, flows, metrics, UX outline, and pitch it to mentors for feedback."
  }
];

interface CurriculumSectionProps {
  onDownloadCurriculum: () => void;
}

export default function CurriculumSection({ onDownloadCurriculum }: CurriculumSectionProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const toggleWeek = (index: number) => {
    setExpandedWeek(expandedWeek === index ? null : index);
  };

  return (
    <section id="curriculum" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Curriculum
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            30 days of immersive, hands-on learning designed for ambitious students who want to break into AI Product Management.
          </p>
        </motion.div>
        
        <div className="space-y-4 mb-12">
          {weeks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover-elevate">
                <CardHeader className="cursor-pointer" onClick={() => toggleWeek(index)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{item.week}</p>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWeek(index);
                      }}
                      aria-expanded={expandedWeek === index}
                      aria-label={`${expandedWeek === index ? 'Collapse' : 'Expand'} ${item.week} details`}
                      data-testid={`button-toggle-week-${index + 1}`}
                    >
                      {expandedWeek === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {expandedWeek === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">What You Learn:</h4>
                          <ul className="space-y-1.5 text-muted-foreground">
                            {item.whatYouLearn.map((point, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary mt-1.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-md">
                          <h4 className="font-semibold mb-1 text-foreground">Outcome:</h4>
                          <p className="text-muted-foreground">{item.outcome}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-foreground">Hands-on Assignment:</h4>
                          <p className="text-muted-foreground">{item.assignment}</p>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2"
            onClick={onDownloadCurriculum}
            data-testid="button-download-curriculum"
          >
            <Download className="h-5 w-5" />
            Download Detailed Curriculum
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
