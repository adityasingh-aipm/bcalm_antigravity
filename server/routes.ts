import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import resourcesRouter from "./routes/resources";
import assessmentRouter from "./routes/assessment";
import analyticsRouter from "./routes/analytics";
import hackathonRouter from "./routes/hackathon";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.use("/api/resources", resourcesRouter);
  app.use("/api/assessment", assessmentRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/hackathon", hackathonRouter);
  
  app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));

  const httpServer = createServer(app);

  return httpServer;
}
