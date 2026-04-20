import { UserRepository } from '../repositories/UserRepository';
import { hashPassword } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError, UnauthorizedError } from '../errors/AppError';
import { ErrorCodes } from '../errors/errorCodes';

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  private userRepo = new UserRepository();

  async register(dto: RegisterDTO) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError(409, ErrorCodes.DUPLICATE_RESOURCE, 'Email already registered');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepo.create({ name: dto.name, email: dto.email, passwordHash });

    const accessToken  = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    return { user, accessToken, refreshToken };
  }

  async login(dto: LoginDTO) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await user.verifyPassword(dto.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    await this.userRepo.update(user.id, { lastLoginAt: new Date() });

    const accessToken  = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    return { user, accessToken, refreshToken };
  }

  async refreshTokens(token: string) {
    const payload = verifyRefreshToken(token);
    const user = await this.userRepo.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    const accessToken  = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });
    return { accessToken, refreshToken };
  }

  async getCurrentUser(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }
    return user;
  }
}
