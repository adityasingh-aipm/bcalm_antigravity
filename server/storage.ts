import { type User, type InsertUser } from "@shared/schema";
import { 
  type ResourcesUser, 
  type InsertResourcesUser,
  type Resource,
  type InsertResource,
  type DownloadLog,
  type InsertDownloadLog
} from "@shared/resourcesSchema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resourcesUsers: Map<string, ResourcesUser>;
  private resources: Map<string, Resource>;
  private downloadLogs: Map<string, DownloadLog>;

  constructor() {
    this.users = new Map();
    this.resourcesUsers = new Map();
    this.resources = new Map();
    this.downloadLogs = new Map();
  }

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
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined> {
    return Array.from(this.resourcesUsers.values()).find(
      (user) => user.email === email,
    );
  }

  async createResourcesUser(insertUser: InsertResourcesUser): Promise<ResourcesUser> {
    const id = randomUUID();
    const user: ResourcesUser = {
      ...insertUser,
      id,
      isAdmin: insertUser.isAdmin ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resourcesUsers.set(id, user);
    return user;
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter((r) => r.isActive);
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      ...insertResource,
      id,
      filePath: insertResource.filePath ?? null,
      fileSize: insertResource.fileSize ?? null,
      isActive: true,
      uploadedDate: new Date(),
      updatedAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, updateData: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) {
      return undefined;
    }

    const updatedResource: Resource = {
      ...resource,
      ...updateData,
      updatedAt: new Date(),
    };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: string): Promise<boolean> {
    const resource = this.resources.get(id);
    if (!resource) {
      return false;
    }

    const updatedResource: Resource = {
      ...resource,
      isActive: false,
      updatedAt: new Date(),
    };
    this.resources.set(id, updatedResource);
    return true;
  }

  async logDownload(insertLog: InsertDownloadLog): Promise<DownloadLog> {
    const id = randomUUID();
    const log: DownloadLog = {
      ...insertLog,
      id,
      downloadedAt: new Date(),
    };
    this.downloadLogs.set(id, log);
    return log;
  }

  async getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }> {
    const activeResources = await this.getAllResources();
    const totalResources = activeResources.length;
    const totalDownloads = this.downloadLogs.size;

    const downloadCounts = new Map<string, number>();
    Array.from(this.downloadLogs.values()).forEach((log) => {
      downloadCounts.set(log.resourceId, (downloadCounts.get(log.resourceId) || 0) + 1);
    });

    let mostDownloaded: { resourceId: string; title: string; downloads: number } | null = null;
    let maxDownloads = 0;

    Array.from(downloadCounts.entries()).forEach(([resourceId, count]) => {
      if (count > maxDownloads) {
        const resource = this.resources.get(resourceId);
        if (resource) {
          mostDownloaded = {
            resourceId,
            title: resource.title,
            downloads: count,
          };
          maxDownloads = count;
        }
      }
    });

    return {
      totalResources,
      totalDownloads,
      mostDownloaded,
    };
  }
}

export const storage = new MemStorage();
