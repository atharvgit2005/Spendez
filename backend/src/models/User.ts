import mongoose, { Document, Schema } from 'mongoose';
import { comparePassword } from '../utils/hash';
import { addIdVirtual } from '../config/mongoose-helpers';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  verifyPassword(plain: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods.verifyPassword = function (plain: string): Promise<boolean> {
  return comparePassword(plain, this.passwordHash);
};

// Don't include passwordHash in JSON output
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as any).passwordHash;
    return ret;
  },
});

addIdVirtual(UserSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
