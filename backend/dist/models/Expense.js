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
exports.Expense = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_helpers_1 = require("../config/mongoose-helpers");
const ExpenseSchema = new mongoose_1.Schema({
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Group', required: true },
    paidBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: 'INR' },
    category: {
        type: String,
        enum: ['FOOD', 'TRAVEL', 'UTILITIES', 'SHOPPING', 'ENTERTAINMENT', 'OTHER'],
        default: 'OTHER',
    },
    splitType: { type: String, enum: ['EQUAL', 'EXACT', 'PERCENTAGE', 'WEIGHTED'], required: true },
    sourceType: { type: String, enum: ['MANUAL', 'OCR'], default: 'MANUAL' },
    receiptUrl: { type: String },
    ocrStatus: { type: String, enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED'] },
    ocrConfidence: { type: Number, min: 0, max: 1 },
    expenseDate: { type: Date, default: Date.now },
    isRecurring: { type: Boolean, default: false },
    recurringKey: { type: String },
}, { timestamps: true });
ExpenseSchema.index({ groupId: 1, expenseDate: -1 });
(0, mongoose_helpers_1.addIdVirtual)(ExpenseSchema);
exports.Expense = mongoose_1.default.model('Expense', ExpenseSchema);
