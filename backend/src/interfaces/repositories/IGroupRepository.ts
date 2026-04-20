import { IGroup } from '../../models/Group';

export interface IGroupRepository {
  create(data: Partial<IGroup>): Promise<IGroup>;
  findById(id: string): Promise<IGroup | null>;
  findAll(filter?: Record<string, unknown>): Promise<IGroup[]>;
  findByMember(userId: string): Promise<IGroup[]>;
  update(id: string, data: Partial<IGroup>): Promise<IGroup | null>;
  delete(id: string): Promise<void>;
}
