import { AuditLog } from '../models/AuditLog';

interface AuditDTO {
  actorUserId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  async log(dto: AuditDTO): Promise<void> {
    await AuditLog.create(dto);
  }
}
