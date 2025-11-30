import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, GraduationCap, BarChart3, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent, trackPageView, getUtmParams, getPagePath } from "@/lib/analytics";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AssessmentLandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    trackPageView();
  }, []);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(isLogin ? authSchema.omit({ name: true }) : authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleAuth = async (data: AuthFormData) => {
    try {
      const endpoint = isLogin ? "/api/resources/auth/login" : "/api/resources/auth/signup";
      const response = await apiRequest("POST", endpoint, data);
      const result = await response.json();

      if (result.token) {
        localStorage.setItem("resources_token", result.token);
        localStorage.setItem("resources_user", JSON.stringify(result.user));
        setShowAuthDialog(false);
        
        // Track signup/login events with UTM params and page path
        const utmParams = getUtmParams();
        const pagePath = getPagePath();
        
        if (isLogin) {
          trackEvent("user_login", { 
            email: data.email,
            pagePath: pagePath,
            utm: utmParams,
            navigationSource: null
          });
        } else {
          trackEvent("user_signup", { 
            name: data.name || "", 
            email: data.email,
            pagePath: pagePath,
            utm: utmParams,
            navigationSource: null
          });
        }
        
        toast({
          title: isLogin ? "Logged in successfully" : "Account created successfully",
          description: `Welcome, ${result.user.name}!`,
        });
        form.reset();
        
        setLocation("/ai-pm-readiness/start");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handleStart = () => {
    if (user) {
      setLocation("/ai-pm-readiness/start");
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-4" style={{ color: "#111111" }}>
            AI PM Readiness Check
          </h1>
          <p className="text-lg md:text-xl mb-2" style={{ color: "#4a5568" }}>
            Are you ready for AI Product roles? Find your strengths, gaps, and a clear learning path.
          </p>
          <p className="text-sm md:text-base" style={{ color: "#9ca3af" }}>
            Designed for 3rd–4th year students and recent graduates · 24 questions · 10 minutes · instant personalized report
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <Button
            size="lg"
            className="text-base px-8"
            onClick={handleStart}
            data-testid="button-start-readiness"
          >
            Start My Readiness Check
          </Button>
          
          {!user && (
            <p className="mt-4 text-sm" style={{ color: "#9ca3af" }}>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowAuthDialog(true);
                }}
                className="text-primary hover:underline"
                data-testid="link-login"
              >
                Log in →
              </button>
            </p>
          )}
        </motion.div>

        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent data-testid="dialog-auth">
            <DialogHeader>
              <DialogTitle>{isLogin ? "Sign In" : "Create Account"}</DialogTitle>
              <DialogDescription>
                {isLogin
                  ? "Sign in to take the AI PM Readiness Check"
                  : "Create an account to take the assessment and save your results"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Your full name"
                    data-testid="input-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="••••••••"
                  data-testid="input-password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <DialogFooter>
                <div className="flex flex-col w-full gap-4">
                  <Button type="submit" className="w-full" data-testid="button-submit-auth">
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      form.reset();
                    }}
                    className="w-full"
                    data-testid="button-toggle-auth-mode"
                  >
                    {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <BarChart3 className="mx-auto mb-3" style={{ width: "32px", height: "32px", color: "#6c47ff" }} />
            <p className="text-sm" style={{ color: "#111111" }}>
              See where you stand across 8 AI PM skills
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <GraduationCap className="mx-auto mb-3" style={{ width: "32px", height: "32px", color: "#6c47ff" }} />
            <p className="text-sm" style={{ color: "#111111" }}>
              Get a personalized gap report + learning recommendations
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg" style={{ background: "#f8f7ff" }}>
            <BookOpen className="mx-auto mb-3" style={{ width: "32px", height: "32px", color: "#6c47ff" }} />
            <p className="text-sm" style={{ color: "#111111" }}>
              Understand how top students move from 'curious' to 'role-ready'
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            You'll need a free Bcalm account so we can save your report and email it to you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
