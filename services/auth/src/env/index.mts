import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().transform((port) => parseInt(port)),
  HOST: z.string(),
});

export const safeEnv = envSchema.safeParse(process.env);

if (!safeEnv.success) {
  console.log("Error while parsing env", safeEnv.error);
  process.exit(1);
}

export const env = safeEnv.data;
