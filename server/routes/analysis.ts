import { Router, Request, Response } from "express";
import { isAuthenticated } from "../supabaseAuth";
import { supabaseAdmin } from "../supabaseClient";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import mammoth from "mammoth";

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
  limits: { fileSize: 5 * 1024 * 1024 },
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

async function extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      const pdfParseModule = await import("pdf-parse");
      const PDFParse = pdfParseModule.PDFParse;
      const dataBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(dataBuffer);
      const pdfParser = new PDFParse(uint8Array);
      const result = await pdfParser.getText();
      const text = typeof result === 'string' ? result : (result?.text || "");
      return text;
    } else if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }
  } catch (error) {
    console.error("Error extracting text:", error);
  }
  return "";
}

router.post("/submit", isAuthenticated, upload.single("cv"), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    if (profile.onboarding_status !== "complete") {
      return res.status(400).json({ message: "Please complete onboarding first" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }
    
    const cvText = await extractTextFromFile(req.file.path, req.file.mimetype);
    
    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({ message: "Could not extract text from CV. Please upload a readable PDF or DOCX file." });
    }

    const metaSnapshot = {
      current_status: profile.current_status,
      target_role: profile.target_role,
      years_experience: profile.years_experience,
      personalization_quality: profile.personalization_quality
    };

    const { data: submission, error: subError } = await supabaseAdmin
      .from('cv_submissions')
      .insert({
        user_id: userId,
        cv_file_path: req.file.path,
        cv_text: cvText,
        meta_snapshot: metaSnapshot
      })
      .select()
      .single();

    if (subError) {
      console.error("Error creating submission:", subError);
      return res.status(500).json({ message: "Failed to create CV submission" });
    }

    const { data: job, error: jobError } = await supabaseAdmin
      .from('analysis_jobs')
      .insert({
        submission_id: submission.id,
        user_id: userId,
        status: 'processing'
      })
      .select()
      .single();

    if (jobError) {
      console.error("Error creating job:", jobError);
      return res.status(500).json({ message: "Failed to create analysis job" });
    }
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const payload = {
          id: submission.id,
          cv_text: cvText,
          meta_snapshot: metaSnapshot,
          jobId: job.id
        };

        console.log("Triggering n8n webhook with payload:", JSON.stringify(payload, null, 2));

        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          console.error("n8n webhook returned error:", response.status, await response.text());
          await supabaseAdmin
            .from('analysis_jobs')
            .update({ 
              status: 'failed',
              error_text: 'Failed to connect to analysis service'
            })
            .eq('id', job.id);
        }
      } catch (webhookError) {
        console.error("Error calling n8n webhook:", webhookError);
        await supabaseAdmin
          .from('analysis_jobs')
          .update({ 
            status: 'failed',
            error_text: 'Failed to connect to analysis service'
          })
          .eq('id', job.id);
      }
    } else {
      setTimeout(async () => {
        const mockResult = {
          role_preset: profile.target_role || "General",
          overall_score: 72,
          score_breakdown: {
            ats: { score: 75, feedback: "Good keyword optimization" },
            impact: { score: 70, feedback: "Could use more quantifiable results" },
            role_signals: { score: 68, feedback: "Role alignment is decent" },
            job_match: { score: 75, feedback: "Good match overall", skipped: !profile.target_role }
          },
          summary: "Your CV shows solid potential with good technical skills. Focus on adding measurable achievements and industry-specific keywords to boost your score.",
          top_strengths: [
            { point: "Strong technical background", evidence: "Listed relevant skills", why_it_works: "Demonstrates capability" },
            { point: "Clear project descriptions", evidence: "Projects have context", why_it_works: "Shows practical experience" },
            { point: "Good educational credentials", evidence: "Listed degree and institution", why_it_works: "Establishes credibility" }
          ],
          top_fixes: [
            { point: "Add more metrics", expected_lift: 5, why_weak: "Achievements lack numbers", recommended: "Include percentages, numbers, or revenue impact" },
            { point: "Optimize for ATS", expected_lift: 3, why_weak: "Some keywords missing", recommended: "Add industry-standard terminology" },
            { point: "Strengthen summary", expected_lift: 4, why_weak: "Summary is generic", recommended: "Tailor to target role with specific achievements" }
          ],
          bullet_review: [],
          info_needed_from_user: profile.target_role ? [] : ["What specific role are you targeting?"],
          seven_step_plan: [
            { step: 1, action: "Add a compelling professional summary", priority: "high" },
            { step: 2, action: "Quantify your achievements with metrics", priority: "high" },
            { step: 3, action: "Optimize keywords for your target role", priority: "medium" },
            { step: 4, action: "Improve project descriptions with outcomes", priority: "medium" },
            { step: 5, action: "Add relevant certifications if any", priority: "low" },
            { step: 6, action: "Review formatting for ATS compatibility", priority: "low" },
            { step: 7, action: "Get feedback from industry professionals", priority: "low" }
          ],
          job_match_section: {
            match_score: profile.target_role ? 75 : null,
            missing_skills: [],
            strong_matches: []
          }
        };

        await supabaseAdmin
          .from('analysis_jobs')
          .update({
            status: 'complete',
            result_json: mockResult,
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);
      }, 5000);
    }
    
    res.json({ ok: true, jobId: job.id });
  } catch (error) {
    console.error("Error submitting CV for analysis:", error);
    res.status(500).json({ message: "Failed to submit CV for analysis" });
  }
});

router.get("/share/:jobId", async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    const { data: job, error } = await supabaseAdmin
      .from('analysis_jobs')
      .select('id, status, result_json, created_at')
      .eq('id', jobId)
      .single();
    
    if (error || !job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.status !== 'complete') {
      return res.status(400).json({ message: "Analysis not complete" });
    }
    
    const result = job.result_json?.result || job.result_json || {};
    
    res.json({
      id: job.id,
      status: job.status,
      share_data: {
        overall_score: result.overall_score || 0,
        role_preset: result.role_preset || "General",
        summary: result.summary?.split('.')[0] || "",
        top_strength: result.top_strengths?.[0]?.point || result.top_strengths?.[0] || "",
      }
    });
  } catch (error) {
    console.error("Error fetching share data:", error);
    res.status(500).json({ message: "Failed to fetch share data" });
  }
});

router.get("/:jobId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).userId;
    
    const { data: job, error } = await supabaseAdmin
      .from('analysis_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (error || !job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.user_id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const resultData = job.result_json?.result || job.result_json || {};
    
    res.json({
      id: job.id,
      status: job.status,
      report: resultData,
      error_text: job.error_text,
      created_at: job.created_at,
      completed_at: job.completed_at,
    });
  } catch (error) {
    console.error("Error fetching analysis job:", error);
    res.status(500).json({ message: "Failed to fetch analysis job" });
  }
});

router.get("/user/jobs", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: jobs, error } = await supabaseAdmin
      .from('analysis_jobs')
      .select('id, status, result_json, created_at, completed_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ message: "Failed to fetch jobs" });
    }
    
    res.json(jobs.map((job: any) => {
      const report = job.result_json?.result || job.result_json || {};
      return {
        id: job.id,
        status: job.status,
        score: report.overall_score,
        createdAt: job.created_at,
        completedAt: job.completed_at,
      };
    }));
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({ message: "Failed to fetch user jobs" });
  }
});

router.get("/files/:jobId", async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const callbackSecret = process.env.N8N_CALLBACK_SECRET;
    const providedSecret = req.headers["x-callback-secret"] || req.query.secret;
    
    if (callbackSecret && providedSecret !== callbackSecret) {
      return res.status(401).json({ message: "Unauthorized access to file" });
    }
    
    const { data: job, error } = await supabaseAdmin
      .from('analysis_jobs')
      .select('submission_id')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { data: submission } = await supabaseAdmin
      .from('cv_submissions')
      .select('cv_file_path')
      .eq('id', job.submission_id)
      .single();

    if (!submission?.cv_file_path) {
      return res.status(404).json({ message: "File not found" });
    }
    
    if (!fs.existsSync(submission.cv_file_path)) {
      return res.status(404).json({ message: "File not found on disk" });
    }
    
    res.sendFile(path.resolve(submission.cv_file_path));
  } catch (error) {
    console.error("Error serving CV file:", error);
    res.status(500).json({ message: "Failed to serve file" });
  }
});

router.post("/callback", async (req: Request, res: Response) => {
  try {
    const callbackSecret = process.env.N8N_CALLBACK_SECRET;
    const providedSecret = req.headers["x-callback-secret"];
    
    if (callbackSecret && providedSecret !== callbackSecret) {
      return res.status(401).json({ message: "Invalid callback secret" });
    }
    
    let resultData = req.body;
    
    if (Array.isArray(resultData) && resultData.length > 0) {
      resultData = resultData[0];
    }
    
    const jobId = resultData.jobId || resultData.meta?.jobId;
    
    if (!jobId) {
      return res.status(400).json({ message: "Missing jobId in callback" });
    }

    const { error } = await supabaseAdmin
      .from('analysis_jobs')
      .update({
        status: 'complete',
        result_json: resultData,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.error("Error updating job:", error);
      return res.status(500).json({ message: "Failed to update job" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing callback:", error);
    res.status(500).json({ message: "Failed to process callback" });
  }
});

export default router;
