"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIChatService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class AIChatService {
    constructor() {
        this.systemPrompt = '';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.GEMINI_API_KEY || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.loadSystemPrompt();
    }
    loadSystemPrompt() {
        try {
            const promptPath = path_1.default.join(__dirname, '../config/gemini-prompt.md');
            this.systemPrompt = fs_1.default.readFileSync(promptPath, 'utf-8');
        }
        catch (err) {
            logger_1.AppLogger.error('Failed to load gemini-prompt.md', err);
            this.systemPrompt = 'You are the Spendez AI Assistant. Help users with expenses.';
        }
    }
    async getChatResponse(userMessage) {
        if (!env_1.env.GEMINI_API_KEY) {
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
        }
        catch (error) {
            logger_1.AppLogger.error('Gemini API Error:', error);
            throw new Error('Failed to generate AI response');
        }
    }
}
exports.AIChatService = AIChatService;
