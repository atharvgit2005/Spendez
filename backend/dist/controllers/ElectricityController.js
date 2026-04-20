"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.electricityController = exports.ElectricityController = void 0;
const ElectricityService_1 = require("../services/ElectricityService");
const electricityService = new ElectricityService_1.ElectricityService();
class ElectricityController {
    async create(req, res, next) {
        try {
            const record = await electricityService.createRecord({
                ...req.body,
                recordedBy: req.user.userId,
            });
            res.status(201).json({ success: true, data: record });
        }
        catch (err) {
            next(err);
        }
    }
    async getGroupRecords(req, res, next) {
        try {
            const records = await electricityService.getGroupRecords(req.params.id);
            res.json({ success: true, data: records });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ElectricityController = ElectricityController;
exports.electricityController = new ElectricityController();
