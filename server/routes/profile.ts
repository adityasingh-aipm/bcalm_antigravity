import { Router, Request, Response } from "express";
import { isAuthenticated, optionalAuth } from "../supabaseAuth";
import { supabaseAdmin } from "../supabaseClient";
import { z } from "zod";

const router = Router();

router.get("/me", optionalAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.json(null);
    }
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      return res.json(null);
    }
    
    res.json({
      id: profile.id,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      current_status: profile.current_status,
      target_role: profile.target_role,
      years_experience: profile.years_experience,
      onboarding_completed: profile.onboarding_status === 'complete',
      onboarding_status: profile.onboarding_status
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

const statusSchema = z.object({
  current_status: z.string().nullable()
});

router.post("/status", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { current_status } = statusSchema.parse(req.body);
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        current_status: current_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating status:", error);
      return res.status(500).json({ message: "Failed to update status" });
    }
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

const roleSchema = z.object({
  target_role: z.string().nullable()
});

router.post("/role", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { target_role } = roleSchema.parse(req.body);
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        target_role: target_role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating role:", error);
      return res.status(500).json({ message: "Failed to update role" });
    }
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
});

const experienceSchema = z.object({
  years_experience: z.number().nullable()
});

router.post("/experience", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { years_experience } = experienceSchema.parse(req.body);
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        years_experience: years_experience,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating experience:", error);
      return res.status(500).json({ message: "Failed to update experience" });
    }
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating experience:", error);
    res.status(500).json({ message: "Failed to update experience" });
  }
});

router.post("/complete-onboarding", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError || !profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    const hasRole = !!profile.target_role;
    const hasExperience = profile.years_experience !== null && profile.years_experience !== undefined;
    const personalizationQuality = hasRole && hasExperience ? "full" : "partial";
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        onboarding_status: 'complete',
        personalization_quality: personalizationQuality,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error completing onboarding:", error);
      return res.status(500).json({ message: "Failed to complete onboarding" });
    }
    
    res.json({ success: true, onboarding_completed: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
  }
});

export default router;
