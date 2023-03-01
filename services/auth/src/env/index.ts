import {z} from 'zod';

const envSchema = z.object({
  PORT: z.string().transform(port => parseInt(port)),
  HOST: z.string(),
  JWT_SIGNING_SECRET: z.string(),
  JWT_REFRESH_SIGNING_SECRET: z.string(),
});

export const safeEnv = envSchema.safeParse(process.env);

if (!safeEnv.success) {
  console.log('Error while parsing env', safeEnv.error);
  throw new Error('Failed to parse env');
}

export const env = safeEnv.data;
