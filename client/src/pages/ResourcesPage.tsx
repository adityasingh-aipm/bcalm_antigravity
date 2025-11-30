import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackEvent, trackPageView, getUtmParams, getPagePath } from "@/lib/analytics";
import { motion } from "framer-motion";
import { Download, FileText, Video, ExternalLink, Book, Lightbulb } from "lucide-react";
import type { Resource } from "@shared/resourcesSchema";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

function ResourceCard({ resource, onDownload }: { resource: Resource; onDownload: (id: string) => void }) {
  const getIcon = () => {
    switch (resource.type) {
      case "pdf":
      case "doc":
        return <FileText className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      case "link":
        return <ExternalLink className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getCategoryIcon = () => {
    switch (resource.category) {
      case "prompts":
        return <Lightbulb className="h-5 w-5" />;
      case "books":
        return <Book className="h-5 w-5" />;
      case "videos":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {getCategoryIcon()}
              <CardTitle className="text-lg">{resource.title}</CardTitle>
            </div>
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
          </div>
          <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium uppercase">{resource.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium capitalize">{resource.category}</span>
            </div>
            {resource.fileSize && (
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium">{formatFileSize(resource.fileSize)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => onDownload(resource.id)}
            data-testid={`button-download-${resource.id}`}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function ResourcesPage() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(localStorage.getItem("resources_token"));

  useEffect(() => {
    trackPageView();
  }, []);

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

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
        setToken(result.token);
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
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (resourceId: string) => {
    if (!token) {
      setShowAuthDialog(true);
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to download resources",
      });
      return;
    }

    window.location.href = `/api/resources/download/${resourceId}?token=${encodeURIComponent(token)}`;
    
    toast({
      title: "Download started",
      description: "Your file is being downloaded",
    });
  };

  const logout = () => {
    localStorage.removeItem("resources_token");
    localStorage.removeItem("resources_user");
    setToken(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const groupedResources = resources?.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>) || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Free Resources for Product Managers</h1>
              <p className="text-xl text-muted-foreground">
                Download curated resources to accelerate your PM career
              </p>
            </motion.div>
            {token ? (
              <Button variant="outline" onClick={logout} data-testid="button-logout">
                Logout
              </Button>
            ) : (
              <Button onClick={() => setShowAuthDialog(true)} data-testid="button-signin">
                Sign In
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading resources...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedResources).map(([category, categoryResources]) => (
                <section key={category}>
                  <h2 className="text-3xl font-semibold mb-6 capitalize">
                    {category === "prompts" && "Free Prompt Library for PMs"}
                    {category === "books" && "Top 20 Books for PMs"}
                    {category === "videos" && "Top PM Videos and Articles"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {Object.keys(groupedResources).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No resources available yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent data-testid="dialog-auth">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Sign In" : "Create Account"}</DialogTitle>
            <DialogDescription>
              {isLogin
                ? "Sign in to download free resources"
                : "Create an account to access all free resources"}
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
    </div>
  );
}
