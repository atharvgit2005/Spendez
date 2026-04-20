import { GroupMember, IGroupMember } from '../models/GroupMember';

export class GroupMemberRepository {
  async create(data: Partial<IGroupMember>): Promise<IGroupMember> {
    return GroupMember.create(data);
  }

  async findByGroup(groupId: string, filterActive = true): Promise<IGroupMember[]> {
    const query: any = { groupId };
    if (filterActive) query.isActive = true;
    return GroupMember.find(query).populate('userId', 'name email avatarUrl');
  }

  async findByUser(userId: string): Promise<IGroupMember[]> {
    return GroupMember.find({ userId, isActive: true }).populate('groupId');
  }

  async update(id: string, data: Partial<IGroupMember>): Promise<IGroupMember | null> {
    return GroupMember.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await GroupMember.findByIdAndUpdate(id, { isActive: false });
  }
}
