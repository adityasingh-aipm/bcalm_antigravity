import { Router, Request, Response } from "express";
import { isAuthenticated } from "../supabaseAuth";
import { supabaseAdmin } from "../supabaseClient";
import { z } from "zod";

const router = Router();

const onboardingSchema = z.object({
  currentStatus: z.enum(["student_fresher", "working_professional", "switching_careers"]).optional(),
  targetRole: z.string().optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
});

router.get("/status", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json({
      onboardingStatus: profile.onboarding_status || "not_started",
      currentStatus: profile.current_status,
      targetRole: profile.target_role,
      yearsExperience: profile.years_experience,
      personalizationQuality: profile.personalization_quality,
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    res.status(500).json({ message: "Failed to fetch onboarding status" });
  }
});

router.post("/update", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const validatedData = onboardingSchema.parse(req.body);
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (validatedData.currentStatus !== undefined) {
      updateData.current_status = validatedData.currentStatus;
    }
    if (validatedData.targetRole !== undefined) {
      updateData.target_role = validatedData.targetRole;
    }
    if (validatedData.yearsExperience !== undefined) {
      updateData.years_experience = validatedData.yearsExperience;
    }
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
    
    res.json({
      onboardingStatus: profile.onboarding_status,
      currentStatus: profile.current_status,
      targetRole: profile.target_role,
      yearsExperience: profile.years_experience,
      personalizationQuality: profile.personalization_quality,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating onboarding:", error);
    res.status(500).json({ message: "Failed to update onboarding" });
  }
});

router.post("/complete", isAuthenticated, async (req: Request, res: Response) => {
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
    
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        onboarding_status: "complete",
        personalization_quality: personalizationQuality,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error completing onboarding:", updateError);
      return res.status(500).json({ message: "Failed to complete onboarding" });
    }
    
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
