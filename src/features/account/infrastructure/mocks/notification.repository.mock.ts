import type { NotificationRepository } from '../../domain/ports/notification-repository.port';
import type { UpdateNotificationsDto } from '../../application/dto/update-notifications.dto';

export class MockNotificationRepository implements NotificationRepository {
  async updatePreferences(_userId: string, _dto: UpdateNotificationsDto): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
