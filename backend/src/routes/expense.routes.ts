import { Router } from 'express';
import { expenseController } from '../controllers/ExpenseController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { CreateExpenseDTO } from '../dtos/expense.dto';

const router = Router();
router.use(authMiddleware);

router.post('/',       validate(CreateExpenseDTO), expenseController.create.bind(expenseController));
router.get('/:id',    expenseController.getOne.bind(expenseController));
router.put('/:id',    expenseController.update.bind(expenseController));
router.delete('/:id', expenseController.delete.bind(expenseController));

export default router;
