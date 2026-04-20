import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/groups/:id/dashboard',  analyticsController.getDashboard.bind(analyticsController));
router.get('/groups/:id/recurring',  analyticsController.getRecurring.bind(analyticsController));
router.get('/users/me/summary',      analyticsController.getUserSummary.bind(analyticsController));

export default router;
