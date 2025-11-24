import { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trackInitialLanding } from "@/lib/analytics";
import LandingPage from "@/pages/LandingPage";

const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const ResourcesAdminDashboard = lazy(() => import("@/pages/ResourcesAdminDashboard"));
const AssessmentLandingPage = lazy(() => import("@/pages/AssessmentLandingPage"));
const AssessmentStartPage = lazy(() => import("@/pages/AssessmentStartPage"));
const AssessmentQuestionsPage = lazy(() => import("@/pages/AssessmentQuestionsPage"));
const AssessmentResultsPage = lazy(() => import("@/pages/AssessmentResultsPage"));
const ShareResultsPage = lazy(() => import("@/pages/ShareResultsPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p style={{ color: "#9ca3af" }}>Loading...</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/resources">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <ResourcesPage />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/resources">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <ResourcesAdminDashboard />
          </Suspense>
        )}
      </Route>
      <Route path="/ai-pm-readiness">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <AssessmentLandingPage />
          </Suspense>
        )}
      </Route>
      <Route path="/ai-pm-readiness/start">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <AssessmentStartPage />
          </Suspense>
        )}
      </Route>
      <Route path="/ai-pm-readiness/questions">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <AssessmentQuestionsPage />
          </Suspense>
        )}
      </Route>
      <Route path="/ai-pm-readiness/share/:shareToken">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <ShareResultsPage />
          </Suspense>
        )}
      </Route>
      <Route path="/ai-pm-readiness/results/:attemptId">
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <AssessmentResultsPage />
          </Suspense>
        )}
      </Route>
      <Route>
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        )}
      </Route>
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
