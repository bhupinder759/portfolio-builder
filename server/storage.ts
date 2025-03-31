import { users, type User, type InsertUser, portfolios, type Portfolio, type InsertPortfolio } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { Store } from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolio(userId: number): Promise<Portfolio | undefined>;
  updatePortfolio(userId: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio>;
  
  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  currentId: number;
  sessionStore: Store;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    
    // Create initial empty portfolio for new user
    const portfolioId = this.currentId++;
    const initialPortfolio: Portfolio = {
      id: portfolioId,
      userId: id,
      theme: 'minimal',
      isPublished: false,
      updatedAt: new Date(),
      firstName: '',
      lastName: '',
      title: '',
      bio: '',
      profileImage: '',
      profilePhotoUrl: '',
      skills: [],
      experiences: [],
      projects: [],
      contactEmail: '',
      contactPhone: '',
      contactLocation: '',
      socialLinks: {}
    };
    
    this.portfolios.set(id, initialPortfolio);
    
    return user;
  }
  
  async getPortfolio(userId: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(userId);
  }
  
  async updatePortfolio(userId: number, portfolioData: Partial<InsertPortfolio>): Promise<Portfolio> {
    const existingPortfolio = this.portfolios.get(userId);
    
    if (!existingPortfolio) {
      throw new Error("Portfolio not found");
    }
    
    const updatedPortfolio = {
      ...existingPortfolio,
      ...portfolioData,
      updatedAt: new Date()
    };
    
    this.portfolios.set(userId, updatedPortfolio);
    return updatedPortfolio;
  }
}

export const storage = new MemStorage();
