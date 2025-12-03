import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { z } from "zod";

const router = Router();

const onboardingSchema = z.object({
  currentStatus: z.enum(["student_fresher", "working_professional", "switching_careers"]).optional(),
  targetRole: z.string().optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
});

router.get("/status", isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      onboardingStatus: user.onboardingStatus || "not_started",
      currentStatus: user.currentStatus,
      targetRole: user.targetRole,
      yearsExperience: user.yearsExperience,
      personalizationQuality: user.personalizationQuality,
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    res.status(500).json({ message: "Failed to fetch onboarding status" });
  }
});

router.post("/update", isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = onboardingSchema.parse(req.body);
    
    const updated = await storage.updateUserOnboarding(userId, validatedData);
    
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      onboardingStatus: updated.onboardingStatus,
      currentStatus: updated.currentStatus,
      targetRole: updated.targetRole,
      yearsExperience: updated.yearsExperience,
      personalizationQuality: updated.personalizationQuality,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating onboarding:", error);
    res.status(500).json({ message: "Failed to update onboarding" });
  }
});

router.post("/complete", isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const hasRole = !!user.targetRole;
    const hasExperience = user.yearsExperience !== null && user.yearsExperience !== undefined;
    const personalizationQuality = hasRole && hasExperience ? "full" : "partial";
    
    const updated = await storage.updateUserOnboarding(userId, {
      onboardingStatus: "complete",
      personalizationQuality,
    });
    
    res.json({
      onboardingStatus: "complete",
      personalizationQuality,
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
  }
});

export default router;
