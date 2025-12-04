import type { Express } from "express";
import { createServer, type Server } from "http";
import resourcesRouter from "./routes/resources";
import assessmentRouter from "./routes/assessment";
import analyticsRouter from "./routes/analytics";
import hackathonRouter from "./routes/hackathon";
import onboardingRouter from "./routes/onboarding";
import analysisRouter from "./routes/analysis";
import leadsRouter from "./routes/leads";
import profileRouter from "./routes/profile";
import cvRouter from "./routes/cv";
import express from "express";
import path from "path";
import fs from "fs";
import { setupSupabaseAuth } from "./supabaseAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupSupabaseAuth(app);

  // Serve Supabase config to frontend (anon key is safe to expose)
  app.get("/api/config/supabase", (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: "Supabase not configured" });
    }
    
    res.json({
      url: supabaseUrl,
      anonKey: supabaseAnonKey
    });
  });

  app.use("/api/resources", resourcesRouter);
  app.use("/api/assessment", assessmentRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/hackathon", hackathonRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/analysis", analysisRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/cv", cvRouter);
  
  app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));
  app.use("/uploads/cv-submissions", express.static(path.join(process.cwd(), "uploads/cv-submissions")));
  app.use("/uploads/cv-analysis", express.static(path.join(process.cwd(), "uploads/cv-analysis")));
  
  // Serve static files for onboarding pages (CSS, JS)
  app.use(express.static(path.join(process.cwd(), "public")));
  
  // Serve onboarding HTML pages
  const publicDir = path.join(process.cwd(), "public");
  
  app.get("/onboarding", (req, res) => {
    res.sendFile(path.join(publicDir, "onboarding-step1.html"));
  });
  
  app.get("/onboarding/role", (req, res) => {
    res.sendFile(path.join(publicDir, "onboarding-step2.html"));
  });
  
  app.get("/onboarding/experience", (req, res) => {
    res.sendFile(path.join(publicDir, "onboarding-step3.html"));
  });
  
  app.get("/upload", (req, res) => {
    res.sendFile(path.join(publicDir, "upload.html"));
  });

  const httpServer = createServer(app);

  return httpServer;
}
