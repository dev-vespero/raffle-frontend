import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().regex(/^04[12346789]\d{7}$/, 'Teléfono inválido (ej: 04121234567)'),
  identification: z.string().regex(/^V-\d{8}$/i, 'Cédula inválida (ej: V-12345678)'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
