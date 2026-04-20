"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrController = exports.OCRController = void 0;
const OCRService_1 = require("../services/OCRService");
const Expense_1 = require("../models/Expense");
const AppError_1 = require("../errors/AppError");
const ocrService = new OCRService_1.OCRService();
class OCRController {
    async upload(req, res, next) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }
            const { rawText, confidence } = await ocrService.extract(req.file.path);
            const amount = ocrService.parseAmount(rawText);
            const category = ocrService.categorizeFromText(rawText);
            const date = ocrService.parseDate(rawText);
            const merchant = ocrService.detectMerchant(rawText);
            res.json({
                success: true,
                data: {
                    rawText,
                    confidence,
                    suggested: { amount, category, expenseDate: date, title: merchant },
                    filePath: req.file.path,
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getStatus(req, res, next) {
        try {
            const expense = await Expense_1.Expense.findById(req.params.billId);
            if (!expense)
                throw new AppError_1.NotFoundError('Bill/Expense', req.params.billId);
            res.json({ success: true, data: { ocrStatus: expense.ocrStatus, ocrConfidence: expense.ocrConfidence } });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.OCRController = OCRController;
exports.ocrController = new OCRController();
