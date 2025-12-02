import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTASectionProps {
  onEnroll: () => void;
  onScheduleCall: () => void;
}

export default function CTASection({ onEnroll, onScheduleCall }: CTASectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of ambitious professionals who've transformed their interview skills and landed roles at top companies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-base px-8 py-6"
              onClick={onEnroll}
              data-testid="button-cta-enroll"
            >
              Enroll Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 py-6"
              onClick={onScheduleCall}
              data-testid="button-cta-call"
            >
              Schedule a 1:1 Call
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
