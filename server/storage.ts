import { type User, type InsertUser, type ResourcesUser, type InsertResourcesUser, type Resource, type InsertResource, type DownloadLog, type InsertDownloadLog, type AssessmentQuestion, type InsertAssessmentQuestion, type AssessmentAttempt, type InsertAssessmentAttempt, type AssessmentAnswer, type InsertAssessmentAnswer, type HackathonRegistration, type InsertHackathonRegistration, users, resourcesUsers, resources, downloadLogs, assessmentQuestions, assessmentAttempts, assessmentAnswers, hackathonRegistrations } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined>;
  getResourcesUserById(id: string): Promise<ResourcesUser | undefined>;
  createResourcesUser(user: InsertResourcesUser): Promise<ResourcesUser>;
  getAllResources(): Promise<Resource[]>;
  getResourceById(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;
  logDownload(log: InsertDownloadLog): Promise<DownloadLog>;
  getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }>;
  
  getAllAssessmentQuestions(): Promise<AssessmentQuestion[]>;
  createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion>;
  createAssessmentAttempt(attempt: InsertAssessmentAttempt): Promise<AssessmentAttempt>;
  getAssessmentAttempt(id: string): Promise<AssessmentAttempt | undefined>;
  getLatestIncompleteAttempt(userId: string): Promise<AssessmentAttempt | undefined>;
  deleteAssessmentAttempt(id: string): Promise<boolean>;
  saveAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer>;
  getAttemptAnswers(attemptId: string): Promise<AssessmentAnswer[]>;
  completeAssessmentAttempt(attemptId: string, totalScore: number, readinessBand: string, scoresJson: string): Promise<AssessmentAttempt | undefined>;
  
  // Hackathon Registration Methods
  createHackathonRegistration(registration: InsertHackathonRegistration): Promise<HackathonRegistration>;
  getHackathonRegistrationById(id: string): Promise<HackathonRegistration | undefined>;
  getHackathonRegistrationByPhone(phone: string): Promise<HackathonRegistration | undefined>;
  getHackathonRegistrationByEmail(email: string): Promise<HackathonRegistration | undefined>;
  updateHackathonOtp(id: string, otpCode: string, expiresAt: Date): Promise<HackathonRegistration | undefined>;
  verifyHackathonRegistration(id: string): Promise<HackathonRegistration | undefined>;
}

export class DatabaseStorage implements IStorage {
  async initialize(): Promise<void> {
    await this.initializeAdminUser();
    await this.initializeAssessmentQuestions();
  }

  private async initializeAdminUser(): Promise<void> {
    const adminEmail = "admin@bcalm.org";
    const adminPassword = "admin123";
    
    const existingAdmin = await this.getResourcesUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log("Admin user already exists:", adminEmail);
      return;
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.createResourcesUser({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });
    
    console.log("Admin user initialized:", adminEmail);
  }

  private async initializeAssessmentQuestions(): Promise<void> {
    const existingQuestions = await this.getAllAssessmentQuestions();
    if (existingQuestions.length > 0) {
      console.log("Assessment questions already seeded:", existingQuestions.length);
      return;
    }

    const { ASSESSMENT_QUESTIONS } = await import("./data/assessmentQuestions");
    
    for (const question of ASSESSMENT_QUESTIONS) {
      await this.createAssessmentQuestion(question);
    }
    
    console.log("Assessment questions initialized:", ASSESSMENT_QUESTIONS.length);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined> {
    const [user] = await db.select().from(resourcesUsers).where(eq(resourcesUsers.email, email));
    return user || undefined;
  }

  async createResourcesUser(insertUser: InsertResourcesUser): Promise<ResourcesUser> {
    const [user] = await db.insert(resourcesUsers).values(insertUser).returning();
    return user;
  }

  async getResourcesUserById(id: string): Promise<ResourcesUser | undefined> {
    const [user] = await db.select().from(resourcesUsers).where(eq(resourcesUsers.id, id));
    return user || undefined;
  }

  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.isActive, true));
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  async updateResource(id: string, updateData: Partial<InsertResource>): Promise<Resource | undefined> {
    const [resource] = await db
      .update(resources)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return resource || undefined;
  }

  async deleteResource(id: string): Promise<boolean> {
    const [resource] = await db
      .update(resources)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return !!resource;
  }

  async logDownload(insertLog: InsertDownloadLog): Promise<DownloadLog> {
    const [log] = await db.insert(downloadLogs).values(insertLog).returning();
    return log;
  }

  async getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }> {
    const activeResources = await this.getAllResources();
    const totalResources = activeResources.length;

    const allDownloads = await db.select().from(downloadLogs);
    const totalDownloads = allDownloads.length;

    const downloadCounts = new Map<string, number>();
    allDownloads.forEach((log) => {
      downloadCounts.set(log.resourceId, (downloadCounts.get(log.resourceId) || 0) + 1);
    });

    let mostDownloaded: { resourceId: string; title: string; downloads: number } | null = null;
    let maxDownloads = 0;

    for (const [resourceId, count] of Array.from(downloadCounts.entries())) {
      if (count > maxDownloads) {
        const resource = await this.getResourceById(resourceId);
        if (resource) {
          mostDownloaded = {
            resourceId,
            title: resource.title,
            downloads: count,
          };
          maxDownloads = count;
        }
      }
    }

    return {
      totalResources,
      totalDownloads,
      mostDownloaded,
    };
  }

  async getAllAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    return await db.select().from(assessmentQuestions).orderBy(assessmentQuestions.orderIndex);
  }

  async createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
    const [newQuestion] = await db.insert(assessmentQuestions).values(question).returning();
    return newQuestion;
  }

  async createAssessmentAttempt(attempt: InsertAssessmentAttempt): Promise<AssessmentAttempt> {
    const [newAttempt] = await db.insert(assessmentAttempts).values(attempt).returning();
    return newAttempt;
  }

  async getAssessmentAttempt(id: string): Promise<AssessmentAttempt | undefined> {
    const [attempt] = await db.select().from(assessmentAttempts).where(eq(assessmentAttempts.id, id));
    return attempt || undefined;
  }

  async getLatestIncompleteAttempt(userId: string): Promise<AssessmentAttempt | undefined> {
    const { and } = await import("drizzle-orm");
    const [attempt] = await db
      .select()
      .from(assessmentAttempts)
      .where(and(
        eq(assessmentAttempts.userId, userId),
        eq(assessmentAttempts.isCompleted, false)
      ))
      .orderBy(sql`${assessmentAttempts.createdAt} DESC`)
      .limit(1);
    return attempt || undefined;
  }

  async deleteAssessmentAttempt(id: string): Promise<boolean> {
    await db.delete(assessmentAnswers).where(eq(assessmentAnswers.attemptId, id));
    const result = await db.delete(assessmentAttempts).where(eq(assessmentAttempts.id, id));
    return true;
  }

  async saveAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer> {
    const { and } = await import("drizzle-orm");
    const existing = await db
      .select()
      .from(assessmentAnswers)
      .where(and(
        eq(assessmentAnswers.attemptId, answer.attemptId),
        eq(assessmentAnswers.questionId, answer.questionId)
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(assessmentAnswers)
        .set({ answerValue: answer.answerValue })
        .where(eq(assessmentAnswers.id, existing[0].id))
        .returning();
      return updated;
    }

    const [newAnswer] = await db.insert(assessmentAnswers).values(answer).returning();
    return newAnswer;
  }

  async getAttemptAnswers(attemptId: string): Promise<AssessmentAnswer[]> {
    return await db.select().from(assessmentAnswers).where(eq(assessmentAnswers.attemptId, attemptId));
  }

  async completeAssessmentAttempt(
    attemptId: string,
    totalScore: number,
    readinessBand: string,
    scoresJson: string
  ): Promise<AssessmentAttempt | undefined> {
    const { nanoid } = await import("nanoid");
    const shareToken = nanoid(16);
    
    const [updated] = await db
      .update(assessmentAttempts)
      .set({
        totalScore,
        readinessBand,
        scoresJson,
        isCompleted: true,
        completedAt: new Date(),
        shareToken,
      })
      .where(eq(assessmentAttempts.id, attemptId))
      .returning();
    return updated || undefined;
  }

  async getAssessmentAttemptByShareToken(shareToken: string): Promise<AssessmentAttempt | undefined> {
    const [attempt] = await db
      .select()
      .from(assessmentAttempts)
      .where(eq(assessmentAttempts.shareToken, shareToken));
    return attempt || undefined;
  }

  async createHackathonRegistration(registration: InsertHackathonRegistration): Promise<HackathonRegistration> {
    const [newRegistration] = await db.insert(hackathonRegistrations).values(registration).returning();
    return newRegistration;
  }

  async getHackathonRegistrationById(id: string): Promise<HackathonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hackathonRegistrations)
      .where(eq(hackathonRegistrations.id, id));
    return registration || undefined;
  }

  async getHackathonRegistrationByPhone(phone: string): Promise<HackathonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hackathonRegistrations)
      .where(eq(hackathonRegistrations.phone, phone));
    return registration || undefined;
  }

  async getHackathonRegistrationByEmail(email: string): Promise<HackathonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hackathonRegistrations)
      .where(eq(hackathonRegistrations.email, email));
    return registration || undefined;
  }

  async updateHackathonOtp(id: string, otpCode: string, expiresAt: Date): Promise<HackathonRegistration | undefined> {
    const [updated] = await db
      .update(hackathonRegistrations)
      .set({ otpCode, otpExpiresAt: expiresAt })
      .where(eq(hackathonRegistrations.id, id))
      .returning();
    return updated || undefined;
  }

  async verifyHackathonRegistration(id: string): Promise<HackathonRegistration | undefined> {
    const [updated] = await db
      .update(hackathonRegistrations)
      .set({ isVerified: true, otpCode: null, otpExpiresAt: null })
      .where(eq(hackathonRegistrations.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
