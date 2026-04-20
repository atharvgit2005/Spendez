"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitController = exports.SplitController = void 0;
const SplitService_1 = require("../services/SplitService");
const splitService = new SplitService_1.SplitService();
class SplitController {
    async applySplit(req, res, next) {
        try {
            const splits = await splitService.applySplit(req.params.id, req.body);
            res.status(201).json({ success: true, data: splits });
        }
        catch (err) {
            next(err);
        }
    }
    async getSplits(req, res, next) {
        try {
            const splits = await splitService.getSplitsForExpense(req.params.id);
            res.json({ success: true, data: splits });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SplitController = SplitController;
exports.splitController = new SplitController();
