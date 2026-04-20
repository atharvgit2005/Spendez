import { Router } from 'express';
import { splitController } from '../controllers/SplitController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { SplitConfigDTO } from '../dtos/split.dto';

const router = Router();
router.use(authMiddleware);

router.post('/:id/split',  validate(SplitConfigDTO), splitController.applySplit.bind(splitController));
router.get('/:id/splits',  splitController.getSplits.bind(splitController));

export default router;
