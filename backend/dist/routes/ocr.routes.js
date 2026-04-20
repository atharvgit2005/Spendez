"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OCRController_1 = require("../controllers/OCRController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
router.post('/upload', upload_middleware_1.uploadMiddleware.single('file'), OCRController_1.ocrController.upload.bind(OCRController_1.ocrController));
router.get('/status/:billId', OCRController_1.ocrController.getStatus.bind(OCRController_1.ocrController));
exports.default = router;
