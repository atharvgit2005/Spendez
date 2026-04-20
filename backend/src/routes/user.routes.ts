import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/me',         userController.getMe.bind(userController));
router.put('/me',         userController.updateMe.bind(userController));
router.get('/me/groups',  userController.getMyGroups.bind(userController));

export default router;
