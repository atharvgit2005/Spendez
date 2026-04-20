import { Router } from 'express';
import { ocrController } from '../controllers/OCRController';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';
import fs from 'fs';

const router = Router();
router.use(authMiddleware);

// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/upload',           uploadMiddleware.single('file'), ocrController.upload.bind(ocrController));
router.get('/status/:billId',    ocrController.getStatus.bind(ocrController));

export default router;
