import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            About the Program
          </h2>
          
          <p className="text-lg text-foreground/90 leading-relaxed">
            This program is created especially for graduating students and early-career professionals from India's top colleges. You'll learn what companies expect from entry-level AI PMs, how to build a job-ready portfolio, and how to confidently navigate PM + AI interviews. Each week blends live learning, hands-on assignments, and personalized guidance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
