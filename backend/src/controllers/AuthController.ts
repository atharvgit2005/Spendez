import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AppLogger } from '../config/logger';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AppLogger.info('Registration attempt:', { email: req.body.email });
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) { 
      AppLogger.error('Registration failed:', err);
      next(err); 
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AppLogger.info('Login attempt:', { email: req.body.email });
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) { 
      AppLogger.error('Login failed:', err);
      next(err); 
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getCurrentUser((req as any).user.userId);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tokens = await authService.refreshTokens(req.body.token);
      res.json({ success: true, data: tokens });
    } catch (err) { next(err); }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // Stateless JWT — client just discards tokens.
    res.json({ success: true, message: 'Logged out' });
  }
}

export const authController = new AuthController();
