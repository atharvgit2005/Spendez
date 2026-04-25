import { Request, Response } from 'express';
import { AIChatService } from '../services/AIChatService';

export class AIController {
  private chatService = new AIChatService();

  chat = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to process AI chat request'
      });
    }
  };
}
