import type { User } from '@/features/auth/domain/entities/user.entity';
import type { UpdateProfileDto } from '../../../application/dto/update-profile.dto';

export interface ProfileRepository {
  updateProfile(userId: string, dto: UpdateProfileDto): Promise<User>;
}
