import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: string;
  channel: 'IN_APP' | 'EMAIL';
  title: string;
  message: string;
  isRead: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveryStatus: 'PENDING' | 'SENT' | 'FAILED';
}

const NotificationSchema = new Schema<INotification>(
  {
    userId:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventType:      { type: String, required: true },
    channel:        { type: String, enum: ['IN_APP', 'EMAIL'], required: true },
    title:          { type: String, required: true },
    message:        { type: String, required: true },
    isRead:         { type: Boolean, default: false },
    scheduledAt:    { type: Date },
    sentAt:         { type: Date },
    deliveryStatus: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
