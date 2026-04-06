import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { GroupService } from '../services/GroupService';
import { PaymentService } from '../services/PaymentService';

const groupService   = new GroupService();
const paymentService = new PaymentService();

export class GroupController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const group = await groupService.createGroup({ ...req.body, createdBy: req.user!.userId });
      res.status(201).json({ success: true, data: group });
    } catch (err) { next(err); }
  }

  async join(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const group = await groupService.joinByCode(req.user!.userId, req.body.joinCode);
      res.json({ success: true, data: group });
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const group = await groupService.getGroup(req.params.id as string);
      res.json({ success: true, data: group });
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const group = await groupService.updateGroup(req.params.id as string, req.user!.userId, req.body);
      res.json({ success: true, data: group });
    } catch (err) { next(err); }
  }

  async archive(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await groupService.archiveGroup(req.params.id as string, req.user!.userId);
      res.json({ success: true, message: 'Group archived' });
    } catch (err) { next(err); }
  }

  async addMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await groupService.addMember(req.params.id as string, req.user!.userId, req.body.userId);
      res.json({ success: true, message: 'Member added' });
    } catch (err) { next(err); }
  }

  async removeMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await groupService.removeMember(req.params.id as string, req.user!.userId, req.params.userId as string);
      res.json({ success: true, message: 'Member removed' });
    } catch (err) { next(err); }
  }

  async getBalances(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const balances = await paymentService.getGroupBalances(req.params.id as string);
      res.json({ success: true, data: balances });
    } catch (err) { next(err); }
  }

  async getSimplifiedDebts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const debts = await paymentService.getSimplifiedDebts(req.params.id as string);
      res.json({ success: true, data: debts });
    } catch (err) { next(err); }
  }
}

export const groupController = new GroupController();
