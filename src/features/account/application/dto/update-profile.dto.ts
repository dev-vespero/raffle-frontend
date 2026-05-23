import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().regex(/^04[12346789]\d{7}$/, 'Teléfono inválido (ej: 04121234567)'),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
