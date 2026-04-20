import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  actorUserId?: mongoose.Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorUserId:  { type: Schema.Types.ObjectId, ref: 'User' },
    action:       { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId:   { type: String },
    requestId:    { type: String },
    ipAddress:    { type: String },
    metadata:     { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Append-only: disable updates explicitly at schema level
AuditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('AuditLog is append-only and cannot be updated.');
});
AuditLogSchema.pre('updateOne', function () {
  throw new Error('AuditLog is append-only and cannot be updated.');
});
AuditLogSchema.pre('updateMany', function () {
  throw new Error('AuditLog is append-only and cannot be updated.');
});

AuditLogSchema.index({ actorUserId: 1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
