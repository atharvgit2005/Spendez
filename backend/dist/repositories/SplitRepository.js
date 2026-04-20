"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRepository = void 0;
const Split_1 = require("../models/Split");
class SplitRepository {
    async create(data) {
        return Split_1.Split.create(data);
    }
    async findById(id) {
        return Split_1.Split.findById(id).populate('userId', 'name email avatarUrl');
    }
    async findAll(filter = {}) {
        return Split_1.Split.find(filter);
    }
    async findByExpense(expenseId) {
        return Split_1.Split.find({ expenseId }).populate('userId', 'name email avatarUrl');
    }
    async update(id, data) {
        return Split_1.Split.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Split_1.Split.findByIdAndDelete(id);
    }
}
exports.SplitRepository = SplitRepository;
