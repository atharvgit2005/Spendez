import { Request, Response, NextFunction } from 'express';
import { SplitService } from '../services/SplitService';

const splitService = new SplitService();

export class SplitController {
  async applySplit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const splits = await splitService.applySplit(req.params.id as string, req.body);
      res.status(201).json({ success: true, data: splits });
    } catch (err) { next(err); }
  }

  async getSplits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const splits = await splitService.getSplitsForExpense(req.params.id as string);
      res.json({ success: true, data: splits });
    } catch (err) { next(err); }
  }
}

export const splitController = new SplitController();
