import { Router } from 'express';
import { electricityController } from '../controllers/ElectricityController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/',              electricityController.create.bind(electricityController));
router.get('/groups/:id',     electricityController.getGroupRecords.bind(electricityController));

export default router;
