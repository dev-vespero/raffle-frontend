import { z } from 'zod';

export const UpdateNotificationsSchema = z.object({
  email: z.boolean(),
  whatsapp: z.boolean(),
});

export type UpdateNotificationsDto = z.infer<typeof UpdateNotificationsSchema>;
