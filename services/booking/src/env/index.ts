import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform(port => parseInt(port))
    .default('5000'),
  HOST: z.string().default('0.0.0.0'),
  DEBUG: z
    .string()
    .default('false')
    .transform(debug => debug === 'true'),
  JWT_SIGNING_SECRET: z.string().default('secret'),
});

export const safeEnv = envSchema.safeParse(process.env);

if (!safeEnv.success) {
  console.error('Error while parsing env', safeEnv.error);
  throw new Error('Failed to parse env');
}

export const env = safeEnv.data;
