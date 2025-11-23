import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import rakeshImage from "@assets/rakesh_malloju.png";
import adityaImage from "@assets/image_1763560763518.png";
import akhilImage from "@assets/image_1763636682683.png";

const instructors = [
  {
    name: "Rakesh Malloju",
    title: "Senior Director of Product",
    company: "Zepto",
    college: "IIM Calcutta",
    image: rakeshImage,
    initials: "RM"
  },
  {
    name: "Aditya Singh",
    title: "Product Manager",
    company: "Apollo247",
    college: "IIT Delhi",
    image: adityaImage,
    initials: "AS"
  },
  {
    name: "Akhil Joy",
    title: "Head of Design (UI/UX)",
    company: "Swiggy, Uber, Zepto",
    college: "MGU",
    image: akhilImage,
    initials: "AJ"
  }
];

export default function InstructorsSection() {
  return (
    <section id="instructors" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Learn Directly from AI Product Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry experts with proven track records at top tech companies
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={instructor.image} alt={instructor.name} />
                      <AvatarFallback>{instructor.initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {instructor.title}
                    </p>
                    <p className="text-sm font-medium text-primary mb-1">
                      {instructor.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {instructor.college}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
