import type { ProfileRepository } from '../../domain/ports/profile-repository.port';
import type { User } from '@/features/auth/domain/entities/user.entity';
import type { UpdateProfileDto } from '../dto/update-profile.dto';

export class UpdateProfileUseCase {
  constructor(private readonly repo: ProfileRepository) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<User> {
    return this.repo.updateProfile(userId, dto);
  }
}
