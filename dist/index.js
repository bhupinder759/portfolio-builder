// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  portfolios;
  currentId;
  sessionStore;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.portfolios = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    const portfolioId = this.currentId++;
    const initialPortfolio = {
      id: portfolioId,
      userId: id,
      theme: "minimal",
      isPublished: false,
      updatedAt: /* @__PURE__ */ new Date(),
      firstName: "",
      lastName: "",
      title: "",
      bio: "",
      profileImage: "",
      profilePhotoUrl: "",
      skills: [],
      experiences: [],
      projects: [],
      contactEmail: "",
      contactPhone: "",
      contactLocation: "",
      socialLinks: {}
    };
    this.portfolios.set(id, initialPortfolio);
    return user;
  }
  async getPortfolio(userId) {
    return this.portfolios.get(userId);
  }
  async updatePortfolio(userId, portfolioData) {
    const existingPortfolio = this.portfolios.get(userId);
    if (!existingPortfolio) {
      throw new Error("Portfolio not found");
    }
    const updatedPortfolio = {
      ...existingPortfolio,
      ...portfolioData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.portfolios.set(userId, updatedPortfolio);
    return updatedPortfolio;
  }
};
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "folio-portfolio-generator-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ id: user.id, username: user.username });
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.status(200).json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user;
    res.json({ id: user.id, username: user.username });
  });
}

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  theme: text("theme").notNull().default("minimal"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  title: text("title"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  profilePhotoUrl: text("profile_photo_url"),
  // Added field for uploaded profile photo
  skills: text("skills").array(),
  experiences: json("experiences"),
  projects: json("projects"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactLocation: text("contact_location"),
  socialLinks: json("social_links"),
  isPublished: boolean("is_published").default(false),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  userId: true,
  updatedAt: true
});
var experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string()
});
var projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  demoLink: z.string().optional(),
  githubLink: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional()
});
var socialLinksSchema = z.object({
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional()
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";
var storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});
var upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});
async function registerRoutes(app2) {
  app2.get("/static-test", (req, res) => {
    const staticHtmlPath = path.resolve(process.cwd(), "static-test.html");
    if (fs.existsSync(staticHtmlPath)) {
      res.sendFile(staticHtmlPath);
    } else {
      res.status(404).send("Static test file not found");
    }
  });
  app2.get("/static-auth", (req, res) => {
    const staticAuthPath = path.resolve(process.cwd(), "static-auth.html");
    if (fs.existsSync(staticAuthPath)) {
      res.sendFile(staticAuthPath);
    } else {
      res.status(404).send("Static auth file not found");
    }
  });
  app2.get("/api/status", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });
  setupAuth(app2);
  app2.get("/api/portfolio", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const userId = req.user.id;
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  });
  app2.patch("/api/portfolio", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const userId = req.user.id;
      let validData;
      try {
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
  app2.get("/api/try-theme/:themeId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const userId = req.user.id;
      const { themeId } = req.params;
      const validThemes = ["minimal", "tech", "creative", "elegant", "nature", "modern"];
      if (!validThemes.includes(themeId)) {
        return res.status(400).json({ message: "Invalid theme ID" });
      }
      const updatedPortfolio = await storage.updatePortfolio(userId, { theme: themeId });
      res.redirect("/dashboard");
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/upload/profile-photo", upload.single("profilePhoto"), async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const userId = req.user.id;
      const uploadedFilePath = path.relative(process.cwd(), req.file.path);
      const updatedPortfolio = await storage.updatePortfolio(userId, {
        profilePhotoUrl: `/${uploadedFilePath.replace(/\\/g, "/")}`
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
  app2.get("/uploads/*", (req, res) => {
    const filePath = path.join(process.cwd(), req.path);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(filePath);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var rootDir = process.cwd();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin()
  ],
  resolve: {
    alias: {
      "@": path2.resolve(rootDir, "client", "src"),
      "@shared": path2.resolve(rootDir, "shared"),
      "@assets": path2.resolve(rootDir, "attached_assets")
    }
  },
  root: path2.resolve(rootDir, "client"),
  build: {
    outDir: path2.resolve(rootDir, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    log(`Serving on port ${port}`);
  });
})();
