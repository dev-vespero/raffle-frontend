import { z } from 'zod';

// Schema para validar variables de entorno
const envSchema = z.object({
  VITE_API_URL: z.string().url().optional().default('http://localhost:3000/api/v1'),
  VITE_APP_NAME: z.string().optional().default('Moto Moto Rifas'),
  VITE_RECAPTCHA_KEY: z.string().optional().default('6LctjKkfAAAAAAvlMbLxs_6tz_2H_jzkh0MT87V1'),
});

// Validar y parsear variables de entorno
const parseEnv = () => {
  const result = envSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_RECAPTCHA_KEY: import.meta.env.VITE_RECAPTCHA_KEY,
  });

  if (!result.success) {
    console.error('❌ Error en variables de entorno:', result.error.format());
    throw new Error('Variables de entorno inválidas');
  }

  return result.data;
};

export const envConfig = parseEnv();
export type EnvConfig = z.infer<typeof envSchema>;
