export interface UserNotifications {
  email: boolean;
  whatsapp: boolean;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly phone: string,
    public readonly identification: string,
    public readonly emailVerified: boolean,
    public readonly notifications: UserNotifications,
    public readonly createdAt: string,
  ) {}

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  hasNotification(channel: keyof UserNotifications): boolean {
    return this.notifications[channel];
  }

  static fromApi(data: Record<string, unknown>): User {
    return new User(
      data.id as string,
      data.email as string,
      data.name as string,
      data.phone as string,
      data.identification as string,
      data.emailVerified as boolean,
      data.notifications as UserNotifications,
      data.createdAt as string,
    );
  }
}
