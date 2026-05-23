import axiosInstance from '@/core/api/client';
import type { ApiResponse } from '@/core/types/api.types';
import { User } from '@/features/auth/domain/entities/user.entity';
import type { ProfileRepository } from '../../domain/ports/profile-repository.port';
import type { UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { ACCOUNT_CONFIG } from '../config/account.config';

export class HttpProfileRepository implements ProfileRepository {
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const response = await axiosInstance.patch<ApiResponse<Record<string, unknown>>>(
      ACCOUNT_CONFIG.ENDPOINTS.PROFILE,
      dto,
    );

    return User.fromApi(response.data.data);
  }
}
