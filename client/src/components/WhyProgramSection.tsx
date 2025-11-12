import { Card, CardContent } from "@/components/ui/card";
import { Building2, Compass, MessageCircle, Award } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: Building2,
    title: "Designed & Delivered by AI Product Leaders",
    description: "Learn from experienced PMs at Google, Microsoft, and innovative AI startups."
  },
  {
    icon: Compass,
    title: "Hands-On Product Simulations & AI Tools",
    description: "Work with real AI tools and frameworks through practical case studies."
  },
  {
    icon: MessageCircle,
    title: "1:1 Mentorship and Career Guidance",
    description: "Get personalized feedback and career advice from industry experts."
  },
  {
    icon: Award,
    title: "Certificate + Industry Network Access",
    description: "Earn recognition and connect with a community of AI product professionals."
  }
];

export default function WhyProgramSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why This Program
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to launch your AI Product Manager career
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((item, index) => {
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
