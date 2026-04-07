import mongoose, { Document, Schema } from 'mongoose';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface IExpense extends Document {
  id: string;
  groupId: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: 'FOOD' | 'TRAVEL' | 'UTILITIES' | 'SHOPPING' | 'ENTERTAINMENT' | 'OTHER';
  splitType: 'EQUAL' | 'EXACT' | 'PERCENTAGE' | 'WEIGHTED';
  sourceType: 'MANUAL' | 'OCR';
  receiptUrl?: string;
  ocrStatus?: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';
  ocrConfidence?: number;
  expenseDate: Date;
  isRecurring: boolean;
  recurringKey?: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    groupId:       { type: Schema.Types.ObjectId, ref: 'Group',  required: true },
    paidBy:        { type: Schema.Types.ObjectId, ref: 'User',   required: true },
    title:         { type: String, required: true, trim: true },
    description:   { type: String },
    amount:        { type: Number, required: true, min: 0.01 },
    currency:      { type: String, default: 'INR' },
    category:      {
      type: String,
      enum: ['FOOD', 'TRAVEL', 'UTILITIES', 'SHOPPING', 'ENTERTAINMENT', 'OTHER'],
      default: 'OTHER',
    },
    splitType:     { type: String, enum: ['EQUAL', 'EXACT', 'PERCENTAGE', 'WEIGHTED'], required: true },
    sourceType:    { type: String, enum: ['MANUAL', 'OCR'], default: 'MANUAL' },
    receiptUrl:    { type: String },
    ocrStatus:     { type: String, enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED'] },
    ocrConfidence: { type: Number, min: 0, max: 1 },
    expenseDate:   { type: Date, default: Date.now },
    isRecurring:   { type: Boolean, default: false },
    recurringKey:  { type: String },
  },
  { timestamps: true }
);

ExpenseSchema.index({ groupId: 1, expenseDate: -1 });

addIdVirtual(ExpenseSchema);
export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
