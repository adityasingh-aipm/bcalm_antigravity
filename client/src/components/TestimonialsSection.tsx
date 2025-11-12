import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import priyaImage from "@assets/generated_images/Female_IIT_student_testimonial_e0fb5fa7.png";
import rohanImage from "@assets/generated_images/Male_BITS_student_testimonial_a5817a1b.png";
import ananyaImage from "@assets/generated_images/Female_NIT_student_testimonial_6481001f.png";

const testimonials = [
  {
    quote: "This program helped me connect product thinking with AI — I feel ready for PM interviews.",
    name: "Priya S.",
    college: "IIT Delhi",
    image: priyaImage,
    initials: "PS"
  },
  {
    quote: "Learning from real AI PMs gave me clarity on what top companies look for.",
    name: "Rohan M.",
    college: "BITS Pilani",
    image: rohanImage,
    initials: "RM"
  },
  {
    quote: "I built and pitched an AI product idea within 30 days — incredible experience!",
    name: "Ananya K.",
    college: "NIT Trichy",
    image: ananyaImage,
    initials: "AK"
  }
];

export default function TestimonialsSection() {
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
            Student Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students who transformed their careers with our program
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <blockquote className="text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.college}</p>
                    </div>
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
