import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import resourcesRouter from "./routes/resources";
import assessmentRouter from "./routes/assessment";
import analyticsRouter from "./routes/analytics";
import hackathonRouter from "./routes/hackathon";
import cvSubmissionsRouter from "./routes/cv-submissions";
import onboardingRouter from "./routes/onboarding";
import analysisRouter from "./routes/analysis";
import express from "express";
import path from "path";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes - get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Application routes
  app.use("/api/resources", resourcesRouter);
  app.use("/api/assessment", assessmentRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/hackathon", hackathonRouter);
  app.use("/api/cv", cvSubmissionsRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/analysis", analysisRouter);
  
  app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));
  app.use("/uploads/cv-submissions", express.static(path.join(process.cwd(), "uploads/cv-submissions")));
  app.use("/uploads/cv-analysis", express.static(path.join(process.cwd(), "uploads/cv-analysis")));

  const httpServer = createServer(app);

  return httpServer;
}
