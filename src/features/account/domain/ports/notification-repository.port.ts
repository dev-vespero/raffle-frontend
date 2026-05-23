import type { UpdateNotificationsDto } from '../../../application/dto/update-notifications.dto';

export interface NotificationRepository {
  updatePreferences(userId: string, dto: UpdateNotificationsDto): Promise<void>;
}
