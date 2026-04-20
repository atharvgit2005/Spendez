import mongoose, { Document, Schema } from 'mongoose';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface IBudget extends Document {
  id: string;
  ownerType: 'USER' | 'GROUP';
  ownerId: string;
  limitAmount: number;
  usedAmount: number;
  periodType: 'MONTHLY' | 'WEEKLY' | 'CUSTOM';
  periodStart: Date;
  periodEnd: Date;
  alertThreshold: number;
  alertEnabled: boolean;
}

const BudgetSchema = new Schema<IBudget>(
  {
    ownerType:      { type: String, enum: ['USER', 'GROUP'], required: true },
    ownerId:        { type: String, required: true },
    limitAmount:    { type: Number, required: true, min: 0 },
    usedAmount:     { type: Number, default: 0 },
    periodType:     { type: String, enum: ['MONTHLY', 'WEEKLY', 'CUSTOM'], required: true },
    periodStart:    { type: Date, required: true },
    periodEnd:      { type: Date, required: true },
    alertThreshold: { type: Number, default: 0.8, min: 0, max: 1 },
    alertEnabled:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

BudgetSchema.index({ ownerType: 1, ownerId: 1 });

addIdVirtual(BudgetSchema);
export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);
