import { Router } from 'express';
import { budgetController } from '../controllers/BudgetController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/',                          budgetController.create.bind(budgetController));
router.get('/:ownerType/:ownerId',        budgetController.get.bind(budgetController));
router.put('/:id',                        budgetController.update.bind(budgetController));

export default router;
