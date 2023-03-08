import {z} from 'zod';

export const passwordSchema = z.string().min(8);
export const rememberMeSchema = z.object({
  rememberMe: z.boolean().default(false),
});

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export type Credentials = z.infer<typeof credentialsSchema>;

export const resetPasswordSchema = credentialsSchema.extend({
  newPassword: passwordSchema,
});

export type ResetPassword = z.infer<typeof resetPasswordSchema>;
