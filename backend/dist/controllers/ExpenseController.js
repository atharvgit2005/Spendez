"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseController = exports.ExpenseController = void 0;
const ExpenseService_1 = require("../services/ExpenseService");
const expenseService = new ExpenseService_1.ExpenseService();
class ExpenseController {
    async create(req, res, next) {
        try {
            const expense = await expenseService.createExpense({ ...req.body, paidBy: req.user.userId });
            res.status(201).json({ success: true, data: expense });
        }
        catch (err) {
            next(err);
        }
    }
    async getOne(req, res, next) {
        try {
            const expense = await expenseService.getExpense(req.params.id);
            res.json({ success: true, data: expense });
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const expense = await expenseService.updateExpense(req.params.id, req.user.userId, req.body);
            res.json({ success: true, data: expense });
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            await expenseService.deleteExpense(req.params.id, req.user.userId);
            res.json({ success: true, message: 'Expense deleted' });
        }
        catch (err) {
            next(err);
        }
    }
    async getGroupExpenses(req, res, next) {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '20', 10);
            const expenses = await expenseService.getGroupExpenses(req.params.id, page, limit);
            res.json({ success: true, data: expenses, page, limit });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ExpenseController = ExpenseController;
exports.expenseController = new ExpenseController();
