import { Card, CardContent } from "@/components/ui/card";
import { FileText, Briefcase, MessageSquare, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const supportCards = [
  {
    icon: FileText,
    title: "Resume Optimization",
    description: "1:1 expert review and optimization so your resume highlights PM-ready skills and AI understanding."
  },
  {
    icon: Briefcase,
    title: "Build Your Portfolio",
    description: "Hands-on assignments and product simulations to create a strong PM + AI portfolio. NEW: Build and present your own AI product case study."
  },
  {
    icon: MessageSquare,
    title: "Extensive Interview Prep",
    description: "AI + Product + Strategy interview prep. Mock interviews, frameworks, practice questions, and personalized feedback."
  },
  {
    icon: Building2,
    title: "Job Board & Referrals",
    description: "Access curated PM + AI opportunities, hiring partner intros, and alumni referrals when available."
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
            Extensive Career Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to turn your skills into real opportunities.
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
