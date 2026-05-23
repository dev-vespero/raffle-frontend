import type { NotificationRepository } from '../domain/ports/notification-repository.port';
import { HttpNotificationRepository } from './api/notification.repository.http';
import { MockNotificationRepository } from './mocks/notification.repository.mock';
import { ACCOUNT_CONFIG } from './config/account.config';

export function createNotificationRepository(): NotificationRepository {
  return ACCOUNT_CONFIG.USE_MOCKS
    ? new MockNotificationRepository()
    : new HttpNotificationRepository();
}
