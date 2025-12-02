import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const comparisonData = [
  {
    benefit: "Resume Feedback",
    traditional: "No expert review, guesswork",
    bcalm: "AI-powered CV scoring + expert review from hiring managers at top companies",
    bcalmWins: true
  },
  {
    benefit: "Interview Practice",
    traditional: "Watching YouTube videos alone",
    bcalm: "Simulated mock interviews with real-time, actionable feedback",
    bcalmWins: true
  },
  {
    benefit: "Job Discovery",
    traditional: "Spray-and-pray applications",
    bcalm: "Curated job board with insider hiring signals & referral opportunities",
    bcalmWins: true
  },
  {
    benefit: "Expert Guidance",
    traditional: "Generic career advice online",
    bcalm: "Direct mentorship from IIT/IIM alumni working at Zepto, Google, Amazon",
    bcalmWins: true
  },
  {
    benefit: "Personalized Feedback",
    traditional: "No feedback loop",
    bcalm: "Detailed feedback on every session — know exactly where to improve",
    bcalmWins: true
  },
  {
    benefit: "Community",
    traditional: "Prep alone in isolation",
    bcalm: "Join 1000+ ambitious peers from IITs, NITs, BITS + lifelong network",
    bcalmWins: true
  },
  {
    benefit: "Timeline",
    traditional: "Months of scattered, unstructured prep",
    bcalm: "Structured 30-day roadmap designed to get you interview-ready fast",
    bcalmWins: true
  },
  {
    benefit: "Success Rate",
    traditional: "Low callback rates, wasted effort",
    bcalm: "3x higher interview callback rate with optimized applications",
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
            See how Bcalm compares to preparing on your own
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
                      <th className="text-left p-4 font-semibold bg-muted/30 hidden md:table-cell">Self-Prep / Traditional</th>
                      <th className="text-left p-4 font-semibold bg-primary/10">Bcalm Interview Platform</th>
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
            Bcalm isn't just prep — it's your launchpad to landing your dream role.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
