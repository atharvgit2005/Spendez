import { IGroupRepository } from '../interfaces/repositories/IGroupRepository';
import { Group, IGroup } from '../models/Group';

export class GroupRepository implements IGroupRepository {
  async create(data: Partial<IGroup>): Promise<IGroup> {
    return Group.create(data);
  }

  async findById(id: string): Promise<IGroup | null> {
    return Group.findById(id).populate('createdBy', 'name email avatarUrl');
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IGroup[]> {
    return Group.find(filter).populate('createdBy', 'name email');
  }

  async findByMember(userId: string): Promise<IGroup[]> {
    return Group.find({ memberIds: userId, isArchived: false });
  }

  async update(id: string, data: Partial<IGroup>): Promise<IGroup | null> {
    return Group.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Group.findByIdAndUpdate(id, { isArchived: true });
  }
}
