import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import resourcesRouter from "./routes/resources";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.use("/api/resources", resourcesRouter);
  
  app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));

  const httpServer = createServer(app);

  return httpServer;
}
