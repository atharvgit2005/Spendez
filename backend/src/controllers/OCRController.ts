import { Request, Response, NextFunction } from 'express';
import { OCRService } from '../services/OCRService';
import { Expense } from '../models/Expense';
import { NotFoundError } from '../errors/AppError';

const ocrService = new OCRService();

export class OCRController {
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { rawText, confidence } = await ocrService.extract(req.file.path);
      const amount   = ocrService.parseAmount(rawText);
      const category = ocrService.categorizeFromText(rawText);
      const date     = ocrService.parseDate(rawText);
      const merchant = ocrService.detectMerchant(rawText);

      res.json({
        success: true,
        data: {
          rawText,
          confidence,
          suggested: { amount, category, expenseDate: date, title: merchant },
          filePath: req.file.path,
        },
      });
    } catch (err) { next(err); }
  }

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const expense = await Expense.findById(req.params.billId as string);
      if (!expense) throw new NotFoundError('Bill/Expense', req.params.billId as string);
      res.json({ success: true, data: { ocrStatus: expense.ocrStatus, ocrConfidence: expense.ocrConfidence } });
    } catch (err) { next(err); }
  }
}

export const ocrController = new OCRController();
