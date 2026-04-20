import mongoose, { Document, Schema } from 'mongoose';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface IElectricityRecord extends Document {
  id: string;
  groupId: mongoose.Types.ObjectId;
  recordedBy: mongoose.Types.ObjectId;
  previousUnits: number;
  currentUnits: number;
  ratePerUnit: number;
  fixedCharge: number;
  totalAmount: number;
  billingStart: Date;
  billingEnd: Date;
}

const ElectricityRecordSchema = new Schema<IElectricityRecord>(
  {
    groupId:       { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    recordedBy:    { type: Schema.Types.ObjectId, ref: 'User',  required: true },
    previousUnits: { type: Number, required: true, min: 0 },
    currentUnits:  { type: Number, required: true, min: 0 },
    ratePerUnit:   { type: Number, required: true, min: 0 },
    fixedCharge:   { type: Number, required: true, min: 0 },
    totalAmount:   { type: Number, required: true, min: 0 },
    billingStart:  { type: Date, required: true },
    billingEnd:    { type: Date, required: true },
  },
  { timestamps: true }
);

ElectricityRecordSchema.path('currentUnits').validate(function (val: number) {
  return val >= this.get('previousUnits');
}, 'currentUnits must be >= previousUnits');

ElectricityRecordSchema.index({ groupId: 1, billingEnd: -1 });

addIdVirtual(ElectricityRecordSchema);

export const ElectricityRecord = mongoose.model<IElectricityRecord>(
  'ElectricityRecord',
  ElectricityRecordSchema
);
