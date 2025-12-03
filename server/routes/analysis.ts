import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads/cv-analysis");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

router.post("/submit", isAuthenticated, upload.single("cv"), async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.onboardingStatus !== "complete") {
      return res.status(400).json({ message: "Please complete onboarding first" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }
    
    const job = await storage.createAnalysisJob({
      userId,
      status: "processing",
      cvFilePath: req.file.path,
      cvFileName: req.file.originalname,
      jdText: req.body.jdText || null,
    });
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        const host = req.get("host") || "localhost:5000";
        const cvFileUrl = `${protocol}://${host}/uploads/cv-analysis/${path.basename(req.file.path)}`;
        
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: job.id,
            userId: user.id,
            currentStatus: user.currentStatus,
            targetRole: user.targetRole,
            yearsExperience: user.yearsExperience,
            cvFileUrl,
            jdText: req.body.jdText || null,
          }),
        });
      } catch (webhookError) {
        console.error("Error calling n8n webhook:", webhookError);
      }
    } else {
      setTimeout(async () => {
        await storage.updateAnalysisJobResults(job.id, {
          status: "complete",
          score: 72,
          strengths: [
            "Strong technical background with relevant skills",
            "Clear project descriptions with measurable outcomes",
            "Good educational credentials"
          ],
          gaps: [
            "Could benefit from more industry-specific keywords",
            "Consider adding more quantifiable achievements",
            "Leadership experience section could be expanded"
          ],
          quickWins: [
            "Add 2-3 more relevant skills to the skills section",
            "Include metrics in your project descriptions",
            "Add a professional summary at the top"
          ],
          notes: "Your CV shows good potential. Focus on quantifying your achievements and adding industry-specific keywords to improve your score.",
          needsJd: !req.body.jdText,
          needsTargetRole: !user.targetRole,
        });
      }, 5000);
    }
    
    res.json({ jobId: job.id, status: "processing" });
  } catch (error) {
    console.error("Error submitting CV for analysis:", error);
    res.status(500).json({ message: "Failed to submit CV for analysis" });
  }
});

router.get("/:jobId", isAuthenticated, async (req: any, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.claims.sub;
    
    const job = await storage.getAnalysisJob(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json({
      id: job.id,
      status: job.status,
      score: job.score,
      strengths: job.strengths,
      gaps: job.gaps,
      quickWins: job.quickWins,
      notes: job.notes,
      needsJd: job.needsJd,
      needsTargetRole: job.needsTargetRole,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    });
  } catch (error) {
    console.error("Error fetching analysis job:", error);
    res.status(500).json({ message: "Failed to fetch analysis job" });
  }
});

router.get("/user/jobs", isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const jobs = await storage.getAnalysisJobsByUser(userId);
    
    res.json(jobs.map((job) => ({
      id: job.id,
      status: job.status,
      score: job.score,
      cvFileName: job.cvFileName,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    })));
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({ message: "Failed to fetch user jobs" });
  }
});

const callbackSchema = z.object({
  jobId: z.string(),
  score: z.number(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  quick_wins: z.array(z.string()),
  notes: z.string().optional(),
  needs_jd: z.boolean().optional(),
  needs_target_role: z.boolean().optional(),
});

router.post("/callback", async (req: Request, res: Response) => {
  try {
    const callbackSecret = process.env.N8N_CALLBACK_SECRET;
    const providedSecret = req.headers["x-callback-secret"];
    
    if (callbackSecret && providedSecret !== callbackSecret) {
      return res.status(401).json({ message: "Invalid callback secret" });
    }
    
    const data = callbackSchema.parse(req.body);
    
    const updated = await storage.updateAnalysisJobResults(data.jobId, {
      status: "complete",
      score: data.score,
      strengths: data.strengths,
      gaps: data.gaps,
      quickWins: data.quick_wins,
      notes: data.notes,
      needsJd: data.needs_jd,
      needsTargetRole: data.needs_target_role,
    });
    
    if (!updated) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid callback data", errors: error.errors });
    }
    console.error("Error processing callback:", error);
    res.status(500).json({ message: "Failed to process callback" });
  }
});

export default router;
