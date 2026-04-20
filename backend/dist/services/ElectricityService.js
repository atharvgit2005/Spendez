"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricityService = void 0;
const ElectricityRecord_1 = require("../models/ElectricityRecord");
class ElectricityService {
    async createRecord(dto) {
        const unitsConsumed = dto.currentUnits - dto.previousUnits;
        const totalAmount = unitsConsumed * dto.ratePerUnit + dto.fixedCharge;
        return ElectricityRecord_1.ElectricityRecord.create({
            ...dto,
            totalAmount: Math.round(totalAmount * 100) / 100,
        });
    }
    async getGroupRecords(groupId) {
        return ElectricityRecord_1.ElectricityRecord.find({ groupId })
            .populate('recordedBy', 'name email')
            .sort({ billingEnd: -1 });
    }
}
exports.ElectricityService = ElectricityService;
