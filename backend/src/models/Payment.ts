import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  groupId: mongoose.Types.ObjectId;
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'CASH' | 'UPI' | 'BANK' | 'OTHER';
  status: 'PENDING' | 'COMPLETED';
  referenceNote?: string;
  paidAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    groupId:       { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    fromUserId:    { type: Schema.Types.ObjectId, ref: 'User',  required: true },
    toUserId:      { type: Schema.Types.ObjectId, ref: 'User',  required: true },
    amount:        { type: Number, required: true, min: 0.01 },
    currency:      { type: String, default: 'INR' },
    method:        { type: String, enum: ['CASH', 'UPI', 'BANK', 'OTHER'], default: 'CASH' },
    status:        { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
    referenceNote: { type: String },
    paidAt:        { type: Date },
  },
  { timestamps: true }
);

PaymentSchema.index({ groupId: 1 });
PaymentSchema.index({ fromUserId: 1, toUserId: 1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
