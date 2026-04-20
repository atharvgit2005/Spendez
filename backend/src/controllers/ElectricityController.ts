import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ElectricityService } from '../services/ElectricityService';

const electricityService = new ElectricityService();

export class ElectricityController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await electricityService.createRecord({
        ...req.body,
        recordedBy: req.user!.userId,
      });
      res.status(201).json({ success: true, data: record });
    } catch (err) { next(err); }
  }

  async getGroupRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await electricityService.getGroupRecords(req.params.id as string);
      res.json({ success: true, data: records });
    } catch (err) { next(err); }
  }
}

export const electricityController = new ElectricityController();
