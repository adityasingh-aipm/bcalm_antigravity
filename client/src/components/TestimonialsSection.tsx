import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import priyaImage from "@assets/generated_images/Female_IIT_student_testimonial_e0fb5fa7.png";
import arjunImage from "@assets/generated_images/Male_BITS_student_testimonial_a5817a1b.png";
import rheaImage from "@assets/generated_images/Female_NIT_student_testimonial_6481001f.png";
import siddharthImage from "@assets/generated_images/Male_IIT_Madras_student_testimonial_1724e208.png";
import aditiImage from "@assets/generated_images/Female_IIIT_Hyderabad_student_testimonial_a6c7c126.png";
import karanImage from "@assets/generated_images/Male_NIT_Surathkal_student_testimonial_50308592.png";

const testimonials = [
  {
    quote: "This program connected AI with real product thinking. The assignments and feedback made me truly interview-ready.",
    name: "Priya S.",
    college: "IIT Delhi",
    image: priyaImage,
    initials: "PS"
  },
  {
    quote: "Resume + portfolio help was priceless. I landed my first PM internship because of the portfolio I built here.",
    name: "Arjun R.",
    college: "BITS Pilani",
    image: arjunImage,
    initials: "AR"
  },
  {
    quote: "I built my first AI product case study as the capstone. Interviewers loved it.",
    name: "Rhea M.",
    college: "NIT Trichy",
    image: rheaImage,
    initials: "RM"
  },
  {
    quote: "The community is incredible — the quality of peers pushes you to do better work.",
    name: "Siddharth P.",
    college: "IIT Madras",
    image: siddharthImage,
    initials: "SP"
  },
  {
    quote: "Learning from working AI PMs gave me clarity you can't find in textbooks.",
    name: "Aditi S.",
    college: "IIIT Hyderabad",
    image: aditiImage,
    initials: "AS"
  },
  {
    quote: "The opportunity board and referrals helped me get real interviews at AI startups.",
    name: "Karan J.",
    college: "NIT Surathkal",
    image: karanImage,
    initials: "KJ"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students who transformed their careers with our program
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate" data-testid={`card-testimonial-${index}`}>
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
