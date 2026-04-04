import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';
import { NotFoundError } from '../errors/AppError';

export class UserService {
  private userRepo = new UserRepository();

  async getProfile(userId: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User', userId);
    return user;
  }

  async updateProfile(userId: string, data: Partial<Pick<IUser, 'name' | 'avatarUrl'>>): Promise<IUser> {
    const user = await this.userRepo.update(userId, data);
    if (!user) throw new NotFoundError('User', userId);
    return user;
  }
}
