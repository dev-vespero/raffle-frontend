import type { NotificationRepository } from '../../domain/ports/notification-repository.port';
import type { UpdateNotificationsDto } from '../dto/update-notifications.dto';

export class UpdateNotificationPreferencesUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(userId: string, dto: UpdateNotificationsDto): Promise<void> {
    return this.repo.updatePreferences(userId, dto);
  }
}
