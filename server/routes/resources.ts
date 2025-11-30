import { Router, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { authenticateToken, requireAdmin, generateToken, type AuthRequest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { insertResourcesUserSchema, insertResourceSchema } from "@shared/schema";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/auth/signup", async (req, res) => {
  try {
    const validatedData = insertResourcesUserSchema.parse(req.body);
    
    const existingUser = await storage.getResourcesUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const user = await storage.createResourcesUser({
      ...validatedData,
      password: hashedPassword,
    });

    const token = generateToken(user.id, user.email, user.isAdmin);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await storage.getResourcesUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.email, user.isAdmin);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await storage.getResourcesUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.email, user.isAdmin);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/", async (req, res) => {
  try {
    const resources = await storage.getAllResources();
    res.json(resources);
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

router.get("/download/:resourceId", async (req: AuthRequest, res: Response) => {
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.split(" ")[1];
  const queryToken = req.query.token as string;
  const token = headerToken || queryToken;

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.SESSION_SECRET || "") as {
      userId: string;
      email: string;
      isAdmin: boolean;
    };
    req.user = decoded;
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
  try {
    const { resourceId } = req.params;
    
    const resource = await storage.getResourceById(resourceId);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (resource.type === "link") {
      try {
        await storage.logDownload({
          userId: req.user!.userId,
          resourceId: resource.id,
        });
      } catch (logError) {
        console.error("Failed to log link download:", logError);
      }
      return res.json({ url: resource.filePath });
    }

    if (!resource.filePath) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(process.cwd(), resource.filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error("File not found on disk:", filePath);
      return res.status(404).json({ error: "File not found on server" });
    }

    const stats = fs.statSync(filePath);
    const filename = resource.originalFileName || path.basename(filePath);
    const mimeType = resource.mimeType || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream file" });
      }
    });

    fileStream.on("end", async () => {
      try {
        await storage.logDownload({
          userId: req.user!.userId,
          resourceId: resource.id,
        });
      } catch (logError) {
        console.error("Failed to log download (file already sent):", logError);
      }
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to download resource" });
    }
  }
});

router.post("/admin/upload", authenticateToken, requireAdmin, upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, type } = req.body;

    let filePath: string | null = null;
    let fileSize: number | null = null;
    let originalFileName: string | null = null;
    let mimeType: string | null = null;

    if (req.file) {
      filePath = req.file.path;
      fileSize = req.file.size;
      originalFileName = req.file.originalname;
      mimeType = req.file.mimetype;
    } else if (type === "link" && req.body.filePath) {
      filePath = req.body.filePath;
    }

    const resourceData = {
      title,
      description,
      category,
      type,
      filePath,
      fileSize,
      originalFileName,
      mimeType,
    };

    const validatedData = insertResourceSchema.parse(resourceData);
    
    const resource = await storage.createResource(validatedData);

    res.status(201).json(resource);
  } catch (error) {
    console.error("Upload error:", error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error });
    }
    res.status(500).json({ error: "Failed to upload resource" });
  }
});

router.put("/admin/:resourceId", authenticateToken, requireAdmin, upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const { title, description, category, type, filePath } = req.body;

    const existingResource = await storage.getResourceById(resourceId);
    if (!existingResource) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: "Resource not found" });
    }

    const updateData: Partial<typeof insertResourceSchema._type> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (type) updateData.type = type;

    if (req.file) {
      if (existingResource.filePath && existingResource.filePath.startsWith("uploads/")) {
        try {
          fs.unlinkSync(existingResource.filePath);
        } catch (err) {
          console.error("Failed to delete old file:", err);
        }
      }
      updateData.filePath = req.file.path;
      updateData.fileSize = req.file.size;
      updateData.originalFileName = req.file.originalname;
      updateData.mimeType = req.file.mimetype;
    } else if (filePath && type === "link") {
      updateData.filePath = filePath;
    }

    const updatedResource = await storage.updateResource(resourceId, updateData);

    if (!updatedResource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json(updatedResource);
  } catch (error) {
    console.error("Update error:", error);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to cleanup uploaded file:", err);
      }
    }
    res.status(500).json({ error: "Failed to update resource" });
  }
});

router.delete("/admin/:resourceId", authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    
    const success = await storage.deleteResource(resourceId);
    
    if (!success) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

router.get("/admin/stats", authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await storage.getDownloadStats();
    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
