import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trackInitialLanding } from "@/lib/analytics";
import LandingPage from "@/pages/LandingPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ResourcesAdminDashboard from "@/pages/ResourcesAdminDashboard";
import AssessmentLandingPage from "@/pages/AssessmentLandingPage";
import AssessmentStartPage from "@/pages/AssessmentStartPage";
import AssessmentQuestionsPage from "@/pages/AssessmentQuestionsPage";
import AssessmentResultsPage from "@/pages/AssessmentResultsPage";
import ShareResultsPage from "@/pages/ShareResultsPage";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import HackathonPage from "@/pages/HackathonPage";
import ComingSoonPage from "@/pages/ComingSoonPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/admin/resources" component={ResourcesAdminDashboard} />
      <Route path="/ai-pm-readiness" component={AssessmentLandingPage} />
      <Route path="/ai-pm-readiness/start" component={AssessmentStartPage} />
      <Route path="/ai-pm-readiness/questions" component={AssessmentQuestionsPage} />
      <Route path="/ai-pm-readiness/share/:shareToken" component={ShareResultsPage} />
      <Route path="/ai-pm-readiness/results/:attemptId" component={AssessmentResultsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/hackathon" component={HackathonPage} />
      <Route path="/coming-soon/:feature" component={ComingSoonPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    trackInitialLanding();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
