import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPortfolioSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Configure multer storage
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

// Configure multer upload
const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Direct static test route (to help with debugging)
  app.get("/static-test", (req, res) => {
    const staticHtmlPath = path.resolve(process.cwd(), "static-test.html");
    if (fs.existsSync(staticHtmlPath)) {
      res.sendFile(staticHtmlPath);
    } else {
      res.status(404).send("Static test file not found");
    }
  });
  
  // Static auth page (to help with debugging)
  app.get("/static-auth", (req, res) => {
    const staticAuthPath = path.resolve(process.cwd(), "static-auth.html");
    if (fs.existsSync(staticAuthPath)) {
      res.sendFile(staticAuthPath);
    } else {
      res.status(404).send("Static auth file not found");
    }
  });

  // API status endpoint for basic connectivity test
  app.get("/api/status", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Setup authentication routes
  setupAuth(app);

  // Portfolio routes
  app.get("/api/portfolio", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user!.id;
      const portfolio = await storage.getPortfolio(userId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/portfolio", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user!.id;
      
      // Validate request data against schema
      let validData;
      try {
        // Use partial to allow updating only some fields
        validData = insertPortfolioSchema.partial().parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        throw error;
      }
      
      const updatedPortfolio = await storage.updatePortfolio(userId, validData);
      res.json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
  });
  
  // Try theme route - applies a theme to user's portfolio
  app.get("/api/try-theme/:themeId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user!.id;
      const { themeId } = req.params;
      
      // Validate theme ID (Basic validation only)
      const validThemes = ["minimal", "tech", "creative", "elegant", "nature", "modern"];
      if (!validThemes.includes(themeId)) {
        return res.status(400).json({ message: "Invalid theme ID" });
      }
      
      // Update the portfolio theme
      const updatedPortfolio = await storage.updatePortfolio(userId, { theme: themeId });
      
      // Redirect to the dashboard
      res.redirect("/dashboard");
    } catch (error) {
      next(error);
    }
  });

  // Profile photo upload endpoint
  app.post("/api/upload/profile-photo", upload.single('profilePhoto'), async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user!.id;
      
      // Get the relative path to the uploaded file
      const uploadedFilePath = path.relative(process.cwd(), req.file.path);
      
      // Update the portfolio with the new profile photo URL
      const updatedPortfolio = await storage.updatePortfolio(userId, { 
        profilePhotoUrl: `/${uploadedFilePath.replace(/\\/g, '/')}` 
      });
      
      res.json({ 
        success: true, 
        message: "Profile photo uploaded successfully", 
        profilePhotoUrl: updatedPortfolio.profilePhotoUrl 
      });
    } catch (error) {
      next(error);
    }
  });

  // Serve uploaded files statically
  app.get('/uploads/*', (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), req.path);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.sendFile(filePath);
  });

  const httpServer = createServer(app);
  return httpServer;
}
