import mongoose, { Document, Schema } from 'mongoose';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface ISplit extends Document {
  id: string;
  expenseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  shareAmount: number;
  percentage?: number;
  weight?: number;
  status: 'PENDING' | 'SETTLED';
  settledAt?: Date;
}

const SplitSchema = new Schema<ISplit>(
  {
    expenseId:   { type: Schema.Types.ObjectId, ref: 'Expense', required: true },
    userId:      { type: Schema.Types.ObjectId, ref: 'User',    required: true },
    shareAmount: { type: Number, required: true },
    percentage:  { type: Number },
    weight:      { type: Number },
    status:      { type: String, enum: ['PENDING', 'SETTLED'], default: 'PENDING' },
    settledAt:   { type: Date },
  },
  { timestamps: true }
);

SplitSchema.index({ expenseId: 1 });
SplitSchema.index({ userId: 1, status: 1 });

addIdVirtual(SplitSchema);
export const Split = mongoose.model<ISplit>('Split', SplitSchema);
