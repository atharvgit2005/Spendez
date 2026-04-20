"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const Expense_1 = require("../models/Expense");
class ExpenseRepository {
    async create(data) {
        return Expense_1.Expense.create(data);
    }
    async findById(id) {
        return Expense_1.Expense.findById(id)
            .populate('paidBy', 'name email avatarUrl')
            .populate('groupId', 'name');
    }
    async findAll(filter = {}) {
        return Expense_1.Expense.find(filter).sort({ expenseDate: -1 });
    }
    async findByGroup(groupId, page = 1, limit = 20) {
        return Expense_1.Expense.find({ groupId })
            .populate('paidBy', 'name email avatarUrl')
            .sort({ expenseDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async update(id, data) {
        return Expense_1.Expense.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Expense_1.Expense.findByIdAndDelete(id);
    }
}
exports.ExpenseRepository = ExpenseRepository;
