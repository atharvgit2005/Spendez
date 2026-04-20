"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_helpers_1 = require("../config/mongoose-helpers");
const BudgetSchema = new mongoose_1.Schema({
    ownerType: { type: String, enum: ['USER', 'GROUP'], required: true },
    ownerId: { type: String, required: true },
    limitAmount: { type: Number, required: true, min: 0 },
    usedAmount: { type: Number, default: 0 },
    periodType: { type: String, enum: ['MONTHLY', 'WEEKLY', 'CUSTOM'], required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    alertThreshold: { type: Number, default: 0.8, min: 0, max: 1 },
    alertEnabled: { type: Boolean, default: true },
}, { timestamps: true });
BudgetSchema.index({ ownerType: 1, ownerId: 1 });
(0, mongoose_helpers_1.addIdVirtual)(BudgetSchema);
exports.Budget = mongoose_1.default.model('Budget', BudgetSchema);
