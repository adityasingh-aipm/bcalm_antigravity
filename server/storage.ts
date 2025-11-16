import { type User, type InsertUser, type ResourcesUser, type InsertResourcesUser, type Resource, type InsertResource, type DownloadLog, type InsertDownloadLog, users, resourcesUsers, resources, downloadLogs } from "@shared/schema";
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
}

export class DatabaseStorage implements IStorage {
  async initialize(): Promise<void> {
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

    for (const [resourceId, count] of downloadCounts.entries()) {
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
}

export const storage = new DatabaseStorage();
