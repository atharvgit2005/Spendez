import { Router } from 'express';
import { paymentController } from '../controllers/PaymentController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/',                 paymentController.create.bind(paymentController));
router.put('/:id/status',        paymentController.updateStatus.bind(paymentController));

export default router;
