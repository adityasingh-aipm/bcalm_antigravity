import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            About the Program
          </h2>
          
          <p className="text-lg text-foreground/90 leading-relaxed">
            The AI Product Manager Launchpad is a 30-day intensive program designed by industry AI PMs from top tech companies. It bridges the gap between engineering and product — giving you a clear, actionable path to build and lead intelligent products.
          </p>
          
          <p className="text-lg text-foreground/90 leading-relaxed">
            Learn how to think like a product manager, speak the language of AI engineers, and design products powered by data and generative models.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
