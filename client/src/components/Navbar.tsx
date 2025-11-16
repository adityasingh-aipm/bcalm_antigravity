import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-foreground">
            Bcalm
          </div>
          
          <Link 
            href="/resources"
            className="text-foreground font-medium transition-colors hover:text-primary hover:underline decoration-2 underline-offset-4"
            data-testid="link-free-resources"
          >
            Free Resources
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
