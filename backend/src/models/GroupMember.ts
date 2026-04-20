import mongoose, { Document, Schema } from 'mongoose';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface IGroupMember extends Document {
  id: string;
  groupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  memberRole: 'ADMIN' | 'MEMBER';
  joinedAt: Date;
  isActive: boolean;
}

const GroupMemberSchema = new Schema<IGroupMember>(
  {
    groupId:    { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    userId:     { type: Schema.Types.ObjectId, ref: 'User',  required: true },
    memberRole: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
    joinedAt:   { type: Date, default: Date.now },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

addIdVirtual(GroupMemberSchema);

export const GroupMember = mongoose.model<IGroupMember>('GroupMember', GroupMemberSchema);
