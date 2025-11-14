import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const comparisonData = [
  {
    benefit: "Curriculum",
    traditional: "Basic PM theory",
    bcalm: "Deep AI-first PM curriculum covering AI, GenAI, LLM thinking, metrics, and strategy",
    bcalmWins: true
  },
  {
    benefit: "Instructor Expertise",
    traditional: "Limited real PM experience",
    bcalm: "Taught by working AI PMs & leaders from top companies",
    bcalmWins: true
  },
  {
    benefit: "Personalized Support",
    traditional: "Generic feedback",
    bcalm: "1:1 mentorship, assignment feedback, resume + portfolio review, interview coaching",
    bcalmWins: true
  },
  {
    benefit: "Community",
    traditional: "Basic Slack/WhatsApp group",
    bcalm: "Ambitious cohort from IITs, BITS, NITs, IIITs + lifelong alumni network",
    bcalmWins: true
  },
  {
    benefit: "Hands-On Learning",
    traditional: "One capstone project",
    bcalm: "5 simulations + weekly assignments + full capstone with detailed feedback",
    bcalmWins: true
  },
  {
    benefit: "Post-Completion Support",
    traditional: "Ends with cohort",
    bcalm: "2 years of continued help, office hours, and alumni support",
    bcalmWins: true
  },
  {
    benefit: "Offline Events",
    traditional: "Minimal",
    bcalm: "Regular meetups in Bangalore, Delhi NCR, Pune, Mumbai, Hyderabad",
    bcalmWins: true
  },
  {
    benefit: "Industry Connects",
    traditional: "One-time",
    bcalm: "Multiple speaker sessions, founder talks, and AI PM AMA sessions",
    bcalmWins: true
  },
  {
    benefit: "Placement Assistance",
    traditional: "Basic job board",
    bcalm: "Resume review, portfolio creation, mock interviews, job board, alumni referrals",
    bcalmWins: true
  }
];

export default function WhyBcalmSection() {
  return (
    <section id="why-bcalm" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Bcalm?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Bcalm compares to traditional bootcamps
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold bg-muted/30">Benefit</th>
                      <th className="text-left p-4 font-semibold bg-muted/30 hidden md:table-cell">Traditional Bootcamps</th>
                      <th className="text-left p-4 font-semibold bg-primary/10">Bcalm AI PM Launchpad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-4 font-medium text-foreground">{row.benefit}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                        <td className="p-4 bg-primary/5">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{row.bcalm}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-lg font-medium text-foreground">
            Bcalm isn't just a course — it's a launchpad into AI Product Management.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
