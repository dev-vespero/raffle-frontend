import axiosInstance from '@/core/api/client';
import type { ApiResponse } from '@/core/types/api.types';
import type { NotificationRepository } from '../../domain/ports/notification-repository.port';
import type { UpdateNotificationsDto } from '../../application/dto/update-notifications.dto';
import { ACCOUNT_CONFIG } from '../config/account.config';

export class HttpNotificationRepository implements NotificationRepository {
  async updatePreferences(userId: string, dto: UpdateNotificationsDto): Promise<void> {
    await axiosInstance.patch<ApiResponse<void>>(
      ACCOUNT_CONFIG.ENDPOINTS.NOTIFICATIONS,
      { notifications: dto },
    );
  }
}
