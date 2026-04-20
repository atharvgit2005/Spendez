import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AnalyticsService } from '../services/AnalyticsService';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const from = new Date((req.query.from as string) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      const to   = new Date((req.query.to   as string) || new Date());
      const data = await analyticsService.getDashboard(req.params.id as string, from, to);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async getRecurring(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.detectRecurring(req.params.id as string);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async getUserSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const from = new Date((req.query.from as string) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      const to   = new Date((req.query.to   as string) || new Date());
      const data = await analyticsService.getUserSummary(req.user!.userId, from, to);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }
}

export const analyticsController = new AnalyticsController();
