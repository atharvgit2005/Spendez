import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/UserService';
import { GroupService } from '../services/GroupService';

const userService  = new UserService();
const groupService = new GroupService();

export class UserController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getProfile(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  }

  async updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  }

  async getMyGroups(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const groups = await groupService.getUserGroups(req.user!.userId);
      res.json({ success: true, data: groups });
    } catch (err) { next(err); }
  }
}

export const userController = new UserController();
