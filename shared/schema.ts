import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const resourcesUsers = pgTable("resources_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  year: text("year"),
  background: text("background"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  filePath: text("file_path"),
  fileSize: integer("file_size"),
  originalFileName: text("original_file_name"),
  mimeType: text("mime_type"),
  isActive: boolean("is_active").notNull().default(true),
  uploadedDate: timestamp("uploaded_date").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const downloadLogs = pgTable("download_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => resourcesUsers.id),
  resourceId: uuid("resource_id").notNull().references(() => resources.id),
  downloadedAt: timestamp("downloaded_at").notNull().defaultNow(),
});

export const insertResourcesUserSchema = createInsertSchema(resourcesUsers, {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources, {
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["prompts", "books", "videos"], {
    errorMap: () => ({ message: "Category must be prompts, books, or videos" }),
  }),
  type: z.enum(["pdf", "doc", "video", "link"], {
    errorMap: () => ({ message: "Type must be pdf, doc, video, or link" }),
  }),
}).omit({
  id: true,
  uploadedDate: true,
  updatedAt: true,
  isActive: true,
});

export const insertDownloadLogSchema = createInsertSchema(downloadLogs).omit({
  id: true,
  downloadedAt: true,
});

export type ResourcesUser = typeof resourcesUsers.$inferSelect;
export type InsertResourcesUser = z.infer<typeof insertResourcesUserSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type DownloadLog = typeof downloadLogs.$inferSelect;
export type InsertDownloadLog = z.infer<typeof insertDownloadLogSchema>;

export const assessmentQuestions = pgTable("assessment_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  dimension: text("dimension").notNull(),
  questionText: text("question_text").notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assessmentAttempts = pgTable("assessment_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => resourcesUsers.id),
  totalScore: integer("total_score"),
  readinessBand: text("readiness_band"),
  scoresJson: text("scores_json"),
  isCompleted: boolean("is_completed").notNull().default(false),
  shareToken: varchar("share_token", { length: 32 }).unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const assessmentAnswers = pgTable("assessment_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id").notNull().references(() => assessmentAttempts.id),
  questionId: uuid("question_id").notNull().references(() => assessmentQuestions.id),
  answerValue: integer("answer_value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssessmentQuestionSchema = createInsertSchema(assessmentQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentAttemptSchema = createInsertSchema(assessmentAttempts).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertAssessmentAnswerSchema = createInsertSchema(assessmentAnswers).omit({
  id: true,
  createdAt: true,
});

export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestionSchema>;

export type AssessmentAttempt = typeof assessmentAttempts.$inferSelect;
export type InsertAssessmentAttempt = z.infer<typeof insertAssessmentAttemptSchema>;

export type AssessmentAnswer = typeof assessmentAnswers.$inferSelect;
export type InsertAssessmentAnswer = z.infer<typeof insertAssessmentAnswerSchema>;

// Hackathon Registration Schema
export const hackathonRegistrations = pgTable("hackathon_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  companyOrCollege: text("company_or_college").notNull(),
  otpCode: text("otp_code"),
  otpExpiresAt: timestamp("otp_expires_at"),
  isVerified: boolean("is_verified").notNull().default(false),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHackathonRegistrationSchema = createInsertSchema(hackathonRegistrations, {
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  email: z.string().email("Invalid email address").refine(
    (email) => email.endsWith("@gmail.com"),
    "Please use a Gmail address"
  ),
  companyOrCollege: z.string().min(2, "Company/College name is required"),
}).omit({
  id: true,
  otpCode: true,
  otpExpiresAt: true,
  isVerified: true,
  createdAt: true,
});

export type HackathonRegistration = typeof hackathonRegistrations.$inferSelect;
export type InsertHackathonRegistration = z.infer<typeof insertHackathonRegistrationSchema>;
