// This file is used to parse environment variables

import {z} from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform((port: string) => parseInt(port)),
  HOST: z.string(),
  JWT_SIGNING_SECRET: z.string(),
});

export const safeEnv = envSchema.safeParse(process.env);

if (!safeEnv.success) {
  console.log('Error while parsing env', safeEnv.error);
  throw new Error(`Failed to parse env ${safeEnv.error}`);
}

export const env = safeEnv.data;
