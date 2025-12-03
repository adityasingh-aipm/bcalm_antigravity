import type { Express } from "express";
import { createServer, type Server } from "http";
import resourcesRouter from "./routes/resources";
import assessmentRouter from "./routes/assessment";
import analyticsRouter from "./routes/analytics";
import hackathonRouter from "./routes/hackathon";
import onboardingRouter from "./routes/onboarding";
import analysisRouter from "./routes/analysis";
import express from "express";
import path from "path";
import { setupSupabaseAuth } from "./supabaseAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupSupabaseAuth(app);

  app.use("/api/resources", resourcesRouter);
  app.use("/api/assessment", assessmentRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/hackathon", hackathonRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/analysis", analysisRouter);
  
  app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));
  app.use("/uploads/cv-submissions", express.static(path.join(process.cwd(), "uploads/cv-submissions")));
  app.use("/uploads/cv-analysis", express.static(path.join(process.cwd(), "uploads/cv-analysis")));

  const httpServer = createServer(app);

  return httpServer;
}
