import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  const [, params] = useRoute("/coming-soon/:feature");
  const feature = params?.feature || "feature";

  const featureLabels: Record<string, { title: string; description: string }> = {
    "upload-resume": {
      title: "CV Scoring",
      description: "Upload your CV and check where you stand against any job description. Get instant feedback and actionable insights."
    },
    "practice-interviews": {
      title: "Practice Interviews",
      description: "Do multiple mock interviews with AI and get detailed feedback to ace your next interview."
    }
  };

  const currentFeature = featureLabels[feature] || { 
    title: "This Feature", 
    description: "An exciting new feature is in development." 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-violet-500/20 mb-6">
            <Rocket className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Coming Soon
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent mb-4">
          {currentFeature.title}
        </h2>

        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          {currentFeature.description}
        </p>

        <p className="text-sm text-white/50 mb-8">
          We're working hard to bring this to you. Stay tuned!
        </p>

        <Link href="/">
          <Button 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/30 px-8 py-6 text-base"
            data-testid="button-back-home"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Homepage
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
