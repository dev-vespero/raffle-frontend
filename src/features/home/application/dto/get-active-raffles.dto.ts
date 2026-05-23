import { z } from 'zod';

export const GetActiveRafflesSchema = z.object({
  filter: z.enum(['all', 'ending-soon']).default('all'),
});

export type GetActiveRafflesDto = z.infer<typeof GetActiveRafflesSchema>;
