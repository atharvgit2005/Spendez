import { Request, Response, NextFunction } from 'express';
import { BudgetService } from '../services/BudgetService';

const budgetService = new BudgetService();

export class BudgetController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budget = await budgetService.createBudget(req.body);
      res.status(201).json({ success: true, data: budget });
    } catch (err) { next(err); }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budget = await budgetService.getBudget(
        req.params.ownerType as 'USER' | 'GROUP',
        req.params.ownerId as string
      );
      res.json({ success: true, data: budget });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budget = await budgetService.updateBudget(req.params.id as string, req.body);
      res.json({ success: true, data: budget });
    } catch (err) { next(err); }
  }
}

export const budgetController = new BudgetController();
