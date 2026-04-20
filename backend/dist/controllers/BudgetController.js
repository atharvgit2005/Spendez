"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetController = exports.BudgetController = void 0;
const BudgetService_1 = require("../services/BudgetService");
const budgetService = new BudgetService_1.BudgetService();
class BudgetController {
    async create(req, res, next) {
        try {
            const budget = await budgetService.createBudget(req.body);
            res.status(201).json({ success: true, data: budget });
        }
        catch (err) {
            next(err);
        }
    }
    async get(req, res, next) {
        try {
            const budget = await budgetService.getBudget(req.params.ownerType, req.params.ownerId);
            res.json({ success: true, data: budget });
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const budget = await budgetService.updateBudget(req.params.id, req.body);
            res.json({ success: true, data: budget });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.BudgetController = BudgetController;
exports.budgetController = new BudgetController();
