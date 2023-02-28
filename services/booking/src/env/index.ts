import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform(port => parseInt(port))
    .default('5000'),
  HOST: z.string().default('0.0.0.0'),
  DEBUG: z.string().transform(debug => debug === 'true'),
});

export const safeEnv = envSchema.safeParse(process.env);

if (!safeEnv.success) {
  console.log('Error while parsing env', safeEnv.error);
  throw new Error('Failed to parse env');
}

export const env = safeEnv.data;
