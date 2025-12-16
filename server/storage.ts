import { type User, type UpsertUser, type ResourcesUser, type InsertResourcesUser, type Resource, type InsertResource, type DownloadLog, type InsertDownloadLog, type AssessmentQuestion, type InsertAssessmentQuestion, type AssessmentAttempt, type InsertAssessmentAttempt, type AssessmentAnswer, type InsertAssessmentAnswer, type HackathonRegistration, type InsertHackathonRegistration, type CvSubmission, type InsertCvSubmission, type AnalysisJob, type InsertAnalysisJob } from "@shared/schema";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "./supabaseClient";
import { nanoid } from "nanoid";

// Helper to convert snake_case DB results to camelCase domain objects
function mapKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => mapKeysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = mapKeysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Helper to convert camelCase domain inputs to snake_case for DB
function mapKeysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => mapKeysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = mapKeysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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

  // CV Submission Methods
  createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission>;
  getAllCvSubmissions(): Promise<CvSubmission[]>;
  getCvSubmissionStats(): Promise<{ total: number; byRole: Record<string, number>; today: number }>;

  // User Onboarding Methods
  updateUserOnboarding(userId: string, data: {
    currentStatus?: string;
    targetRole?: string;
    yearsExperience?: number;
    onboardingStatus?: string;
    personalizationQuality?: string;
  }): Promise<User | undefined>;

  // Analysis Job Methods
  createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob>;
  getAnalysisJob(id: string): Promise<AnalysisJob | undefined>;
  getAnalysisJobsByUser(userId: string): Promise<AnalysisJob[]>;
  updateAnalysisJobResults(id: string, results: {
    status: string;
    score?: number;
    strengths?: string[];
    gaps?: string[];
    quickWins?: string[];
    notes?: string;
    needsJd?: boolean;
    needsTargetRole?: boolean;
  }): Promise<AnalysisJob | undefined>;
}

export class SupabaseStorage implements IStorage {
  async initialize(): Promise<void> {
    await this.initializeAdminUser();
    await this.initializeAssessmentQuestions();
  }

  private async initializeAdminUser(): Promise<void> {
    if (!supabaseAdmin) {
      console.warn("Supabase Admin not initialized. Skipping Admin User seed.");
      return;
    }
    const adminEmail = "admin@bcalm.org";
    const adminPassword = "admin123";

    try {
      const { data: existingAdmin } = await supabaseAdmin
        .from('resources_users')
        .select('*')
        .eq('email', adminEmail)
        .single();

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
    } catch (error) {
      console.error("Failed to initialize admin user check via Supabase:", error);
    }
  }

  private async initializeAssessmentQuestions(): Promise<void> {
    if (!supabaseAdmin) return;
    try {
      const { count } = await supabaseAdmin.from('assessment_questions').select('*', { count: 'exact', head: true });
      if (count && count > 0) {
        console.log("Assessment questions already seeded:", count);
        return;
      }

      const { ASSESSMENT_QUESTIONS } = await import("./data/assessmentQuestions");

      // Bulk insert
      const questionsSnake = ASSESSMENT_QUESTIONS.map(q => mapKeysToSnakeCase(q));
      const { error } = await supabaseAdmin.from('assessment_questions').insert(questionsSnake);

      if (error) throw error;
      console.log("Assessment questions initialized:", ASSESSMENT_QUESTIONS.length);
    } catch (error) {
      console.error("Failed to seed assessment questions:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data } = await supabaseAdmin.from('users').select('*').eq('id', id).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const snakeData = mapKeysToSnakeCase({ ...userData, updatedAt: new Date() });
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(snakeData, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined> {
    const { data } = await supabaseAdmin.from('resources_users').select('*').eq('email', email).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async createResourcesUser(insertUser: InsertResourcesUser): Promise<ResourcesUser> {
    const snakeData = mapKeysToSnakeCase(insertUser);
    const { data, error } = await supabaseAdmin.from('resources_users').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getResourcesUserById(id: string): Promise<ResourcesUser | undefined> {
    const { data } = await supabaseAdmin.from('resources_users').select('*').eq('id', id).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async getAllResources(): Promise<Resource[]> {
    const { data } = await supabaseAdmin.from('resources').select('*').eq('is_active', true);
    return data ? mapKeysToCamelCase(data) : [];
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const { data } = await supabaseAdmin.from('resources').select('*').eq('id', id).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const snakeData = mapKeysToSnakeCase(insertResource);
    const { data, error } = await supabaseAdmin.from('resources').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async updateResource(id: string, updateData: Partial<InsertResource>): Promise<Resource | undefined> {
    const snakeData = mapKeysToSnakeCase({ ...updateData, updatedAt: new Date() });
    const { data, error } = await supabaseAdmin
      .from('resources')
      .update(snakeData)
      .eq('id', id)
      .select()
      .single();
    if (error) return undefined;
    return mapKeysToCamelCase(data);
  }

  async deleteResource(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('resources')
      .update({ is_active: false, updated_at: new Date() })
      .eq('id', id);
    return !error;
  }

  async logDownload(insertLog: InsertDownloadLog): Promise<DownloadLog> {
    const snakeData = mapKeysToSnakeCase(insertLog);
    const { data, error } = await supabaseAdmin.from('download_logs').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }> {
    const { count: totalResources } = await supabaseAdmin.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true);
    const { data: logs } = await supabaseAdmin.from('download_logs').select('resource_id');

    if (!logs) return { totalResources: totalResources || 0, totalDownloads: 0, mostDownloaded: null };

    const totalDownloads = logs.length;
    const counts: Record<string, number> = {};
    logs.forEach((l: any) => counts[l.resource_id] = (counts[l.resource_id] || 0) + 1);

    let maxId = "";
    let maxCount = 0;
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxCount) { maxCount = count; maxId = id; }
    });

    let mostDownloaded = null;
    if (maxId) {
      const r = await this.getResourceById(maxId);
      if (r) mostDownloaded = { resourceId: maxId, title: r.title, downloads: maxCount };
    }

    return {
      totalResources: totalResources || 0,
      totalDownloads,
      mostDownloaded
    };
  }

  async getAllAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    const { data } = await supabaseAdmin.from('assessment_questions').select('*').order('order_index');
    return data ? mapKeysToCamelCase(data) : [];
  }

  async createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
    const snakeData = mapKeysToSnakeCase(question);
    const { data, error } = await supabaseAdmin.from('assessment_questions').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async createAssessmentAttempt(attempt: InsertAssessmentAttempt): Promise<AssessmentAttempt> {
    const snakeData = mapKeysToSnakeCase(attempt);
    const { data, error } = await supabaseAdmin.from('assessment_attempts').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getAssessmentAttempt(id: string): Promise<AssessmentAttempt | undefined> {
    const { data } = await supabaseAdmin.from('assessment_attempts').select('*').eq('id', id).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async getLatestIncompleteAttempt(userId: string): Promise<AssessmentAttempt | undefined> {
    const { data } = await supabaseAdmin
      .from('assessment_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async deleteAssessmentAttempt(id: string): Promise<boolean> {
    await supabaseAdmin.from('assessment_answers').delete().eq('attempt_id', id);
    const { error } = await supabaseAdmin.from('assessment_attempts').delete().eq('id', id);
    return !error;
  }

  async saveAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer> {
    // Check existing
    const { data: existing } = await supabaseAdmin
      .from('assessment_answers')
      .select('*')
      .eq('attempt_id', answer.attemptId)
      .eq('question_id', answer.questionId)
      .single();

    const snakeAnswer = mapKeysToSnakeCase(answer);

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('assessment_answers')
        .update({ answer_value: answer.answerValue })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return mapKeysToCamelCase(data);
    }

    const { data, error } = await supabaseAdmin.from('assessment_answers').insert(snakeAnswer).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getAttemptAnswers(attemptId: string): Promise<AssessmentAnswer[]> {
    const { data } = await supabaseAdmin.from('assessment_answers').select('*').eq('attempt_id', attemptId);
    return data ? mapKeysToCamelCase(data) : [];
  }

  async completeAssessmentAttempt(
    attemptId: string,
    totalScore: number,
    readinessBand: string,
    scoresJson: string
  ): Promise<AssessmentAttempt | undefined> {
    const shareToken = nanoid(16);
    const { data, error } = await supabaseAdmin
      .from('assessment_attempts')
      .update({
        total_score: totalScore,
        readiness_band: readinessBand,
        scores_json: scoresJson,
        is_completed: true,
        completed_at: new Date(),
        share_token: shareToken
      })
      .eq('id', attemptId)
      .select()
      .single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getAssessmentAttemptByShareToken(shareToken: string): Promise<AssessmentAttempt | undefined> {
    const { data } = await supabaseAdmin.from('assessment_attempts').select('*').eq('share_token', shareToken).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async createHackathonRegistration(registration: InsertHackathonRegistration): Promise<HackathonRegistration> {
    const snakeData = mapKeysToSnakeCase(registration);
    const { data, error } = await supabaseAdmin.from('hackathon_registrations').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getHackathonRegistrationById(id: string): Promise<HackathonRegistration | undefined> {
    const { data } = await supabaseAdmin.from('hackathon_registrations').select('*').eq('id', id).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async getHackathonRegistrationByPhone(phone: string): Promise<HackathonRegistration | undefined> {
    const { data } = await supabaseAdmin.from('hackathon_registrations').select('*').eq('phone', phone).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async getHackathonRegistrationByEmail(email: string): Promise<HackathonRegistration | undefined> {
    const { data } = await supabaseAdmin.from('hackathon_registrations').select('*').eq('email', email).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async updateHackathonOtp(id: string, otpCode: string, expiresAt: Date): Promise<HackathonRegistration | undefined> {
    const { data, error } = await supabaseAdmin
      .from('hackathon_registrations')
      .update({ otp_code: otpCode, otp_expires_at: expiresAt })
      .eq('id', id)
      .select()
      .single();
    if (error) return undefined;
    return mapKeysToCamelCase(data);
  }

  async verifyHackathonRegistration(id: string): Promise<HackathonRegistration | undefined> {
    const { data, error } = await supabaseAdmin
      .from('hackathon_registrations')
      .update({ is_verified: true, otp_code: null, otp_expires_at: null })
      .eq('id', id)
      .select()
      .single();
    if (error) return undefined;
    return mapKeysToCamelCase(data);
  }

  async createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission> {
    const snakeData = mapKeysToSnakeCase(submission);
    const { data, error } = await supabaseAdmin.from('cv_submissions').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getAllCvSubmissions(): Promise<CvSubmission[]> {
    const { data } = await supabaseAdmin.from('cv_submissions').select('*').order('created_at', { ascending: false });
    return data ? mapKeysToCamelCase(data) : [];
  }

  async getCvSubmissionStats(): Promise<{ total: number; byRole: Record<string, number>; today: number }> {
    const submissions = await this.getAllCvSubmissions();
    const total = submissions.length;

    const byRole: Record<string, number> = {};
    submissions.forEach(sub => {
      byRole[sub.targetRole] = (byRole[sub.targetRole] || 0) + 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = submissions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      subDate.setHours(0, 0, 0, 0);
      return subDate.getTime() === today.getTime();
    }).length;

    return { total, byRole, today: todayCount };
  }

  async updateUserOnboarding(userId: string, data: {
    currentStatus?: string;
    targetRole?: string;
    yearsExperience?: number;
    onboardingStatus?: string;
    personalizationQuality?: string;
  }): Promise<User | undefined> {
    const snakeData = mapKeysToSnakeCase({ ...data, updatedAt: new Date() });
    const { data: updated, error } = await supabaseAdmin
      .from('users')
      .update(snakeData)
      .eq('id', userId)
      .select()
      .single();
    if (error) return undefined;
    return mapKeysToCamelCase(updated);
  }

  async createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob> {
    const snakeData = mapKeysToSnakeCase(job);
    const { data, error } = await supabaseAdmin.from('analysis_jobs').insert(snakeData).select().single();
    if (error) throw error;
    return mapKeysToCamelCase(data);
  }

  async getAnalysisJob(id: string): Promise<AnalysisJob | undefined> {
    const { data } = await supabaseAdmin.from('analysis_jobs').select('*').eq('id', id).single();
    return data ? mapKeysToCamelCase(data) : undefined;
  }

  async getAnalysisJobsByUser(userId: string): Promise<AnalysisJob[]> {
    const { data } = await supabaseAdmin.from('analysis_jobs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data ? mapKeysToCamelCase(data) : [];
  }

  async updateAnalysisJobResults(id: string, results: {
    status: string;
    score?: number;
    strengths?: string[];
    gaps?: string[];
    quickWins?: string[];
    notes?: string;
    needsJd?: boolean;
    needsTargetRole?: boolean;
  }): Promise<AnalysisJob | undefined> {
    const snakeData = mapKeysToSnakeCase({
      ...results,
      completedAt: results.status === "complete" ? new Date() : undefined
    });

    const { data, error } = await supabaseAdmin
      .from('analysis_jobs')
      .update(snakeData)
      .eq('id', id)
      .select()
      .single();

    if (error) return undefined;
    return mapKeysToCamelCase(data);
  }
}

export const storage = new SupabaseStorage();
