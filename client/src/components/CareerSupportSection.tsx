import { Card, CardContent } from "@/components/ui/card";
import { FileText, Target, MessageSquare, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const supportCards = [
  {
    icon: FileText,
    title: "AI-Powered CV Scoring",
    description: "Get instant feedback on your resume with our AI scoring system, plus expert review from hiring managers at top companies."
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Identify exactly what's holding you back. Personalized roadmap to fill gaps and match job requirements in your target roles."
  },
  {
    icon: MessageSquare,
    title: "Mock Interview Practice",
    description: "Practice with realistic interview simulations. Get detailed feedback on your answers, body language cues, and areas to improve."
  },
  {
    icon: Building2,
    title: "Job Board & Referrals",
    description: "Access curated opportunities at high-growth startups, hiring partner intros, and alumni referrals to skip the queue."
  }
];

export default function CareerSupportSection() {
  return (
    <section id="career-support" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Land the Job
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From resume to offer letter — we've got you covered at every step.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {supportCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
