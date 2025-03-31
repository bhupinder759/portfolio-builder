import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  theme: text("theme").notNull().default("minimal"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  title: text("title"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  profilePhotoUrl: text("profile_photo_url"), // Added field for uploaded profile photo
  skills: text("skills").array(),
  experiences: json("experiences"),
  projects: json("projects"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactLocation: text("contact_location"),
  socialLinks: json("social_links"),
  isPublished: boolean("is_published").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string(),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  demoLink: z.string().optional(),
  githubLink: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

export const socialLinksSchema = z.object({
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
