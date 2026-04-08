import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ExpenseService } from '../services/ExpenseService';

const expenseService = new ExpenseService();

export class ExpenseController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const expense = await expenseService.createExpense({ ...req.body, paidBy: req.user!.userId });
      res.status(201).json({ success: true, data: expense });
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const expense = await expenseService.getExpense(req.params.id as string);
      res.json({ success: true, data: expense });
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const expense = await expenseService.updateExpense(req.params.id as string, req.user!.userId, req.body);
      res.json({ success: true, data: expense });
    } catch (err) { next(err); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await expenseService.deleteExpense(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Expense deleted' });
    } catch (err) { next(err); }
  }

  async getGroupExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page  = parseInt(req.query.page  as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const expenses = await expenseService.getGroupExpenses(req.params.id as string, page, limit);
      res.json({ success: true, data: expenses, page, limit });
    } catch (err) { next(err); }
  }
}

export const expenseController = new ExpenseController();
