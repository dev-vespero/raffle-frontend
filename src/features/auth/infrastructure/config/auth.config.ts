export const AUTH_CONFIG = {
  USE_MOCKS: import.meta.env.DEV,
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
} as const;
