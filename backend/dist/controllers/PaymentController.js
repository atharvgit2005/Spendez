"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const PaymentService_1 = require("../services/PaymentService");
const paymentService = new PaymentService_1.PaymentService();
class PaymentController {
    async create(req, res, next) {
        try {
            const payment = await paymentService.createPayment({ ...req.body, fromUserId: req.user.userId });
            res.status(201).json({ success: true, data: payment });
        }
        catch (err) {
            next(err);
        }
    }
    async getGroupPayments(req, res, next) {
        try {
            const payments = await paymentService.getGroupPayments(req.params.id);
            res.json({ success: true, data: payments });
        }
        catch (err) {
            next(err);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const payment = await paymentService.updateStatus(req.params.id, req.body.status);
            res.json({ success: true, data: payment });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
