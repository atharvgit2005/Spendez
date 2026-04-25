import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { AppLogger } from '../config/logger';

export class AIChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private systemPrompt: string = '';

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.loadSystemPrompt();
  }

  private loadSystemPrompt() {
    try {
      const promptPath = path.join(__dirname, '../config/gemini-prompt.md');
      this.systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch (err) {
      AppLogger.error('Failed to load gemini-prompt.md', err);
      this.systemPrompt = 'You are the Spendez AI Assistant. Help users with expenses.';
    }
  }

  async getChatResponse(userMessage: string): Promise<string> {
    if (!env.GEMINI_API_KEY) {
      return "I'm currently offline because my Gemini API key hasn't been set up yet!";
    }

    try {
      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `System Instructions: ${this.systemPrompt}` }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I will act as the Spendez AI Assistant following these guidelines." }],
          },
        ],
      });

      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      AppLogger.error('Gemini API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}
