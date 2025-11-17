import express, { Router } from "express";
import { storage } from "../storage";
import { authenticateToken, type AuthRequest } from "../middleware/auth";
import { insertAssessmentAttemptSchema, insertAssessmentAnswerSchema } from "@shared/schema";

const router: Router = express.Router();

router.get("/questions", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const questions = await storage.getAllAssessmentQuestions();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

router.post("/attempts", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const forceNew = req.body?.forceNew === true;

    if (!forceNew) {
      const existingIncomplete = await storage.getLatestIncompleteAttempt(req.user.userId);
      
      if (existingIncomplete) {
        return res.json(existingIncomplete);
      }
    }

    const attempt = await storage.createAssessmentAttempt({
      userId: req.user.userId,
      isCompleted: false,
    });

    res.status(201).json(attempt);
  } catch (error) {
    console.error("Error creating assessment attempt:", error);
    res.status(500).json({ error: "Failed to create attempt" });
  }
});

router.delete("/attempts/incomplete", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const existingIncomplete = await storage.getLatestIncompleteAttempt(req.user.userId);
    
    if (existingIncomplete) {
      await storage.deleteAssessmentAttempt(existingIncomplete.id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing incomplete attempt:", error);
    res.status(500).json({ error: "Failed to clear attempt" });
  }
});

router.post("/answers/:attemptId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { attemptId } = req.params;
    const attempt = await storage.getAssessmentAttempt(attemptId);

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    if (attempt.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to update this attempt" });
    }

    if (attempt.isCompleted) {
      return res.status(400).json({ error: "Attempt already completed" });
    }

    const validatedAnswer = insertAssessmentAnswerSchema.parse({
      attemptId,
      questionId: req.body.questionId,
      answerValue: req.body.answerValue,
    });

    const answer = await storage.saveAssessmentAnswer(validatedAnswer);
    res.json(answer);
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ error: "Failed to save answer" });
  }
});

router.post("/complete/:attemptId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { attemptId } = req.params;
    const attempt = await storage.getAssessmentAttempt(attemptId);

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    if (attempt.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to complete this attempt" });
    }

    if (attempt.isCompleted) {
      return res.status(400).json({ error: "Attempt already completed" });
    }

    const answers = await storage.getAttemptAnswers(attemptId);
    const questions = await storage.getAllAssessmentQuestions();

    if (answers.length !== questions.length) {
      return res.status(400).json({ 
        error: "All questions must be answered before completing",
        answered: answers.length,
        total: questions.length,
      });
    }

    const dimensionScores: Record<string, { total: number; count: number }> = {};
    
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question) {
        if (!dimensionScores[question.dimension]) {
          dimensionScores[question.dimension] = { total: 0, count: 0 };
        }
        dimensionScores[question.dimension].total += answer.answerValue;
        dimensionScores[question.dimension].count += 1;
      }
    }

    const dimensionResults: Record<string, number> = {};
    for (const [dimension, data] of Object.entries(dimensionScores)) {
      dimensionResults[dimension] = data.total;
    }

    const totalScore = answers.reduce((sum, answer) => sum + answer.answerValue, 0);
    
    const readinessBand = 
      totalScore >= 96 ? "Internship Ready" :
      totalScore >= 72 ? "On Track" :
      totalScore >= 48 ? "Building Foundation" :
      "Early Explorer";

    const scoresJson = JSON.stringify(dimensionResults);

    const completedAttempt = await storage.completeAssessmentAttempt(
      attemptId,
      totalScore,
      readinessBand,
      scoresJson
    );

    res.json(completedAttempt);
  } catch (error) {
    console.error("Error completing assessment:", error);
    res.status(500).json({ error: "Failed to complete assessment" });
  }
});

router.get("/results/:attemptId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { attemptId } = req.params;
    const attempt = await storage.getAssessmentAttempt(attemptId);

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    if (attempt.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to view this result" });
    }

    if (!attempt.isCompleted) {
      return res.status(400).json({ error: "Assessment not yet completed" });
    }

    const user = await storage.getResourcesUserById(attempt.userId);
    const answers = await storage.getAttemptAnswers(attemptId);

    res.json({
      attempt,
      user: user ? { name: user.name, email: user.email } : null,
      answerCount: answers.length,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

router.get("/resume", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const incompleteAttempt = await storage.getLatestIncompleteAttempt(req.user.userId);
    
    if (incompleteAttempt) {
      const answers = await storage.getAttemptAnswers(incompleteAttempt.id);
      return res.json({
        hasIncomplete: true,
        attempt: incompleteAttempt,
        answeredCount: answers.length,
      });
    }

    res.json({ hasIncomplete: false });
  } catch (error) {
    console.error("Error checking for resume:", error);
    res.status(500).json({ error: "Failed to check for incomplete attempts" });
  }
});

export default router;
