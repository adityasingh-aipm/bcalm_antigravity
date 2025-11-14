import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield } from "lucide-react";
import { motion } from "framer-motion";

const includedFeatures = [
  "30 days of live sessions with AI PMs",
  "5 hands-on simulations + full capstone",
  "Weekly assignments + detailed feedback",
  "1:1 mentorship sessions",
  "Resume optimization",
  "Portfolio creation support",
  "Mock interviews (AI, PM, product sense, strategy)",
  "Curated job & internship board",
  "Interview frameworks & templates",
  "Lifetime access to session recordings",
  "Lifetime alumni community",
  "Certificate of Completion",
  "Alumni referrals (subject to availability)"
];

interface PricingSectionProps {
  onEnroll: () => void;
  onJoinWaitlist: () => void;
}

export default function PricingSection({ onEnroll, onJoinWaitlist }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Program Fee & Everything You Get
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive training with lifetime access and career support
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 pb-8">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-2xl text-muted-foreground line-through">₹24,999</span>
                </div>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-foreground">₹14,999</span>
                  <Badge variant="secondary" className="ml-3 bg-primary/10 text-primary border-primary/20">
                    Special Cohort Price
                  </Badge>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">7-Day Refund Guarantee</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Try the program for 7 days — if you don't see value, get a full refund. No questions asked.
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <h3 className="font-semibold text-lg mb-6 text-center">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                {includedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6"
                  onClick={onEnroll}
                  data-testid="button-enroll"
                >
                  Enroll at ₹14,999
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base px-8 py-6"
                  onClick={onJoinWaitlist}
                  data-testid="button-pricing-waitlist"
                >
                  Join the Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
