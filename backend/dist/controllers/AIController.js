"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const AIChatService_1 = require("../services/AIChatService");
class AIController {
    constructor() {
        this.chatService = new AIChatService_1.AIChatService();
        this.chat = async (req, res) => {
            try {
                const { message } = req.body;
                if (!message) {
                    return res.status(400).json({ success: false, message: 'Message is required' });
                }
                const responseText = await this.chatService.getChatResponse(message);
                res.status(200).json({
                    success: true,
                    data: { text: responseText }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to process AI chat request'
                });
            }
        };
    }
}
exports.AIController = AIController;
