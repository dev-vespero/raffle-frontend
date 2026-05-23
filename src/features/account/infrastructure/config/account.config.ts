export const ACCOUNT_CONFIG = {
  USE_MOCKS: import.meta.env.DEV,
  ENDPOINTS: {
    PURCHASES: '/purchases',
    PROFILE: '/auth/profile',
    NOTIFICATIONS: '/auth/notifications',
  },
} as const;
