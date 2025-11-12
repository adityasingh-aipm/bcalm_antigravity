import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

const weeks = [
  {
    week: "Week 1",
    title: "Foundations of AI & Product Thinking",
    description: "Understanding AI fundamentals, product strategy, and user-centric design."
  },
  {
    week: "Week 2",
    title: "AI Systems, Data, and Design for PMs",
    description: "Deep dive into AI architectures, data pipelines, and designing for AI products."
  },
  {
    week: "Week 3",
    title: "GenAI, Prompt Engineering, and Product Strategy",
    description: "Master generative AI, prompt design, and strategic product development."
  },
  {
    week: "Week 4",
    title: "Capstone – Design & Pitch an AI Product",
    description: "Apply everything you've learned to build and pitch your own AI product."
  }
];

interface CurriculumSectionProps {
  onDownloadCurriculum: () => void;
}

export default function CurriculumSection({ onDownloadCurriculum }: CurriculumSectionProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What You'll Learn
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive 4-week journey to transform you into an AI Product Manager
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {weeks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.week}</p>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2"
            onClick={onDownloadCurriculum}
            data-testid="button-download-curriculum"
          >
            <Download className="h-5 w-5" />
            Download Detailed Curriculum
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
