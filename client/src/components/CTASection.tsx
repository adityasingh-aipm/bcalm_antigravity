import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTASectionProps {
  onJoinWaitlist: () => void;
  onScheduleCall: () => void;
}

export default function CTASection({ onJoinWaitlist, onScheduleCall }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Your AI Product Journey Today
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get mentored by AI leaders and launch your PM career in 30 days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-base px-8 py-6"
              onClick={onJoinWaitlist}
              data-testid="button-cta-waitlist"
            >
              Join the Waitlist
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 py-6"
              onClick={onScheduleCall}
              data-testid="button-cta-call"
            >
              Schedule a Call
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
