import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('production'),
  MAIL_FROM: z.string(),
  MAIL_PASSWORD: z.string(),
  FRONTEND_URL: z.string(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
