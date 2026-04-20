import { Router } from 'express';
import { notificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/',              notificationController.getAll.bind(notificationController));
router.put('/read-all',      notificationController.markAllRead.bind(notificationController));
router.put('/:id/read',      notificationController.markRead.bind(notificationController));

export default router;
