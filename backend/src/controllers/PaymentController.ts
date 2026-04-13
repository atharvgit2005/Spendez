import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PaymentService } from '../services/PaymentService';

const paymentService = new PaymentService();

export class PaymentController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.createPayment({ ...req.body, fromUserId: req.user!.userId });
      res.status(201).json({ success: true, data: payment });
    } catch (err) { next(err); }
  }

  async getGroupPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await paymentService.getGroupPayments(req.params.id as string);
      res.json({ success: true, data: payments });
    } catch (err) { next(err); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.updateStatus(req.params.id as string, req.body.status);
      res.json({ success: true, data: payment });
    } catch (err) { next(err); }
  }
}

export const paymentController = new PaymentController();
