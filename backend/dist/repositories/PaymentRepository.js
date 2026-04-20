"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const Payment_1 = require("../models/Payment");
class PaymentRepository {
    async create(data) {
        return Payment_1.Payment.create(data);
    }
    async findById(id) {
        return Payment_1.Payment.findById(id)
            .populate('fromUserId', 'name email avatarUrl')
            .populate('toUserId', 'name email avatarUrl');
    }
    async findAll(filter = {}) {
        return Payment_1.Payment.find(filter);
    }
    async findByGroup(groupId) {
        return Payment_1.Payment.find({ groupId })
            .populate('fromUserId', 'name email avatarUrl')
            .populate('toUserId', 'name email avatarUrl')
            .sort({ createdAt: -1 });
    }
    async update(id, data) {
        return Payment_1.Payment.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Payment_1.Payment.findByIdAndDelete(id);
    }
}
exports.PaymentRepository = PaymentRepository;
