import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

// Create Supabase client using runtime env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

router.post("/track", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: "Analytics service unavailable" });
    }

    const { userId, eventName, eventData } = req.body;

    if (!userId || !eventName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { error } = await supabase.from("events").insert([
      {
        user_id: userId,
        event_name: eventName,
        event_data: eventData || {}
      }
    ]);

    if (error) {
      console.error("❌ Supabase tracking error:", error);
      return res.status(500).json({ error: "Failed to track event" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error in analytics endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
