"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseDTO = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.CreateExpenseDTO = zod_1.z.object({
    groupId: zod_1.z.string().refine(val => mongoose_1.Types.ObjectId.isValid(val)).transform(val => new mongoose_1.Types.ObjectId(val)),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().default('INR'),
    category: zod_1.z.enum(['FOOD', 'TRAVEL', 'UTILITIES', 'SHOPPING', 'ENTERTAINMENT', 'OTHER']).default('OTHER'),
    splitType: zod_1.z.enum(['EQUAL', 'EXACT', 'PERCENTAGE', 'WEIGHTED']),
    sourceType: zod_1.z.enum(['MANUAL', 'OCR']).optional().default('MANUAL'),
    expenseDate: zod_1.z.string().optional().transform((s) => (s ? new Date(s) : new Date())),
});
