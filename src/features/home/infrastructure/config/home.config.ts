export const HOME_CONFIG = {
  USE_MOCKS: import.meta.env.DEV,
  ENDPOINTS: {
    ACTIVE_RAFFLES: '/raffles/active',
  },
} as const;
