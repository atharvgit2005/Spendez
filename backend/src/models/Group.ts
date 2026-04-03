import mongoose, { Document, Schema } from 'mongoose';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface IGroup extends Document {
  id: string;
  name: string;
  type: 'TRIP' | 'HOSTEL' | 'EVENT' | 'OTHER';
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  defaultCurrency: string;
  joinCode: string;
  isArchived: boolean;
}

const GroupSchema = new Schema<IGroup>(
  {
    name:            { type: String, required: true, trim: true },
    type:            { type: String, enum: ['TRIP', 'HOSTEL', 'EVENT', 'OTHER'], required: true },
    description:     { type: String },
    createdBy:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds:       [{ type: Schema.Types.ObjectId, ref: 'User' }],
    defaultCurrency: { type: String, default: 'INR' },
    joinCode:        { type: String, unique: true, sparse: true },
    isArchived:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

addIdVirtual(GroupSchema);
export const Group = mongoose.model<IGroup>('Group', GroupSchema);
