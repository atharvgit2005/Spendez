import { Types } from 'mongoose';
import { GroupRepository } from '../repositories/GroupRepository';
import { GroupMember } from '../models/GroupMember';
import { IGroup, Group } from '../models/Group';
import { NotFoundError, ForbiddenError, AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/errorCodes';

interface CreateGroupDTO {
  name: string;
  type: IGroup['type'];
  description?: string;
  createdBy: string;
}

export class GroupService {
  private groupRepo = new GroupRepository();

  async createGroup(dto: CreateGroupDTO): Promise<IGroup> {
    const creatorId = new Types.ObjectId(dto.createdBy);
    const group = await this.groupRepo.create({
      ...dto,
      createdBy: creatorId,
      memberIds: [creatorId],
      joinCode:  Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    // Add creator as ADMIN member
    await GroupMember.create({
      groupId:    group.id,
      userId:     dto.createdBy,
      memberRole: 'ADMIN',
      joinedAt:   new Date(),
    });

    return group;
  }

  async joinByCode(userId: string, joinCode: string): Promise<IGroup> {
    const group = await Group.findOne({ joinCode: joinCode.toUpperCase(), isArchived: false });
    if (!group) throw new NotFoundError('Group', joinCode);

    const existing = await GroupMember.findOne({ groupId: group._id, userId });
    if (existing?.isActive) {
      return group; // Already a member, just return
    }

    await GroupMember.findOneAndUpdate(
      { groupId: group._id, userId },
      { memberRole: 'MEMBER', isActive: true, joinedAt: new Date() },
      { upsert: true, new: true }
    );

    await this.groupRepo.update(group.id, {
      $addToSet: { memberIds: userId },
    } as unknown as Partial<IGroup>);

    return group;
  }

  async getGroup(groupId: string): Promise<IGroup> {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new NotFoundError('Group', groupId);
    return group;
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    return this.groupRepo.findByMember(userId);
  }

  async updateGroup(groupId: string, actorId: string, data: Partial<IGroup>): Promise<IGroup> {
    await this.assertAdminRole(groupId, actorId);
    const updated = await this.groupRepo.update(groupId, data);
    if (!updated) throw new NotFoundError('Group', groupId);
    return updated;
  }

  async archiveGroup(groupId: string, actorId: string): Promise<void> {
    await this.assertAdminRole(groupId, actorId);
    await this.groupRepo.delete(groupId);
  }

  async addMember(groupId: string, actorId: string, userId: string): Promise<void> {
    await this.assertAdminRole(groupId, actorId);
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new NotFoundError('Group', groupId);

    const existing = await GroupMember.findOne({ groupId, userId });
    if (existing?.isActive) {
      throw new AppError(409, ErrorCodes.GROUP_MEMBER_CONFLICT, 'User is already a member');
    }

    await GroupMember.findOneAndUpdate(
      { groupId, userId },
      { memberRole: 'MEMBER', isActive: true, joinedAt: new Date() },
      { upsert: true, new: true }
    );

    await this.groupRepo.update(groupId, {
      $addToSet: { memberIds: userId },
    } as unknown as Partial<IGroup>);
  }

  async removeMember(groupId: string, actorId: string, userId: string): Promise<void> {
    await this.assertAdminRole(groupId, actorId);
    await GroupMember.findOneAndUpdate({ groupId, userId }, { isActive: false });
    await this.groupRepo.update(groupId, {
      $pull: { memberIds: userId },
    } as unknown as Partial<IGroup>);
  }

  private async assertAdminRole(groupId: string, userId: string): Promise<void> {
    const member = await GroupMember.findOne({ groupId, userId, isActive: true });
    if (!member || member.memberRole !== 'ADMIN') {
      throw new ForbiddenError('Only group admins can perform this action');
    }
  }
}
