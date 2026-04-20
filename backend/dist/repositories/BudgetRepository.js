"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRepository = void 0;
const Budget_1 = require("../models/Budget");
class BudgetRepository {
    async create(data) {
        return Budget_1.Budget.create(data);
    }
    async findById(id) {
        return Budget_1.Budget.findById(id);
    }
    async findAll(filter = {}) {
        return Budget_1.Budget.find(filter);
    }
    async findByOwner(ownerType, ownerId) {
        return Budget_1.Budget.findOne({ ownerType, ownerId });
    }
    async update(id, data) {
        return Budget_1.Budget.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        await Budget_1.Budget.findByIdAndDelete(id);
    }
}
exports.BudgetRepository = BudgetRepository;
