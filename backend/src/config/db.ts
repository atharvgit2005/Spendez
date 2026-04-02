import mongoose from 'mongoose';
import { AppLogger } from './logger';
import { env } from './env';

export class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  static async connect(): Promise<void> {
    const inst = this.getInstance();
    if (inst.isConnected) return;
    
    try {
      await mongoose.connect(env.MONGODB_URI);
      inst.isConnected = true;
      AppLogger.info('MongoDB connected');
    } catch (err) {
      AppLogger.error('MongoDB connection error', err);
      throw err;
    }
  }

  static async disconnect(): Promise<void> {
    const inst = this.getInstance();
    if (!inst.isConnected) return;
    await mongoose.disconnect();
    inst.isConnected = false;
    AppLogger.info('MongoDB disconnected');
  }
}

export const db = Database.getInstance();
