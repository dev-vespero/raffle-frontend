import { User } from '@/features/auth/domain/entities/user.entity';
import type { ProfileRepository } from '../../domain/ports/profile-repository.port';
import type { UpdateProfileDto } from '../../application/dto/update-profile.dto';

export class MockProfileRepository implements ProfileRepository {
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return new User(
      userId,
      'demo@motomotorifas.com',
      dto.name,
      dto.phone,
      'V-12345678',
      true,
      { email: true, whatsapp: false },
      '2026-01-01T00:00:00.000Z',
    );
  }
}
