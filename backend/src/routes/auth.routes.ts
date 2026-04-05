import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { RegisterDTO, LoginDTO, RefreshTokenDTO } from '../dtos/auth.dto';

const router = Router();

router.post('/register', validate(RegisterDTO), authController.register.bind(authController));
router.post('/login',    validate(LoginDTO),    authController.login.bind(authController));
router.post('/refresh',  validate(RefreshTokenDTO), authController.refresh.bind(authController));
router.get('/me',        authMiddleware,        authController.me.bind(authController));
router.post('/logout',   authController.logout.bind(authController));

export default router;
