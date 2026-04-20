import { Router } from 'express';
import authRoutes         from './auth.routes';
import userRoutes         from './user.routes';
import groupRoutes        from './group.routes';
import expenseRoutes      from './expense.routes';
import splitRoutes        from './split.routes';
import paymentRoutes      from './payment.routes';
import budgetRoutes       from './budget.routes';
import notificationRoutes from './notification.routes';
import ocrRoutes          from './ocr.routes';
import analyticsRoutes    from './analytics.routes';
import electricityRoutes  from './electricity.routes';
import { authMiddleware } from '../middleware/auth.middleware';
import { expenseController } from '../controllers/ExpenseController';
import { paymentController } from '../controllers/PaymentController';

const router = Router();

router.use('/auth',          authRoutes);
router.use('/users',         userRoutes);
router.use('/groups',        groupRoutes);
router.use('/expenses',      expenseRoutes);
router.use('/expenses',      splitRoutes);
router.use('/payments',      paymentRoutes);
router.use('/budgets',       budgetRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ocr',           ocrRoutes);
router.use('/analytics',     analyticsRoutes);
router.use('/electricity',   electricityRoutes);

// Nested group expense/payment routes
router.get('/groups/:id/expenses', authMiddleware, expenseController.getGroupExpenses.bind(expenseController));
router.get('/groups/:id/payments', authMiddleware, paymentController.getGroupPayments.bind(paymentController));

export default router;
