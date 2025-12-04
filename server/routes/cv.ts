import { Router, Request, Response } from "express";
import { optionalAuth } from "../supabaseAuth";
import { supabaseAdmin } from "../supabaseClient";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
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

router.post("/upload", optionalAuth, upload.single("cv"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }
    
    const userId = (req as any).userId;
    const sessionId = userId || `anon-${nanoid()}`;
    const jdText = req.body.job_description || null;
    
    let currentStatus = req.body.current_status || null;
    let targetRole = req.body.target_role || null;
    let yearsExperience = req.body.years_experience ? parseInt(req.body.years_experience) : null;
    
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('current_status, target_role, years_experience')
        .eq('id', userId)
        .single();
      
      if (profile) {
        currentStatus = profile.current_status || currentStatus;
        targetRole = profile.target_role || targetRole;
        yearsExperience = profile.years_experience ?? yearsExperience;
      }
    }
    
    const cvText = await extractTextFromFile(req.file.path, req.file.mimetype);
    
    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({ message: "Could not extract text from CV. Please upload a readable PDF or DOCX file." });
    }

    const personalizationQuality = targetRole ? 'full' : 'partial';

    const metaSnapshot = {
      current_status: currentStatus,
      target_role: targetRole,
      years_experience: yearsExperience,
      session_id: sessionId,
      jd_text: jdText,
      personalization_quality: personalizationQuality
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

        console.log("Triggering n8n webhook for CV analysis:", job.id);

        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          console.error("n8n webhook returned error:", response.status);
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
          role_preset: targetRole || "General",
          overall_score: 72,
          score_breakdown: {
            ats: { score: 75, feedback: "Good keyword optimization" },
            impact: { score: 70, feedback: "Could use more quantifiable results" },
            role_signals: { score: 68, feedback: "Role alignment is decent" },
            job_match: { score: 75, feedback: "Good match overall", skipped: !targetRole }
          },
          summary: "Your CV shows solid potential with good technical skills.",
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
          info_needed_from_user: targetRole ? [] : ["What specific role are you targeting?"],
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
            match_score: targetRole ? 75 : null,
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
    console.error("Error uploading CV:", error);
    res.status(500).json({ message: "Failed to upload CV" });
  }
});

export default router;
