import {z} from 'zod';
import {USER_ROLES} from '~/config';

export const jsonWebTokenSchema = z
  .string()
  .refine(token => token.split('.').length === 3);

export const jsonWebTokenPayloadSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string(),
    role: z.enum(USER_ROLES),
  }),
  type: z.literal('access'),
});

export type JsonWebToken = z.infer<typeof jsonWebTokenSchema>;
export type JsonWebTokenPayload = z.infer<typeof jsonWebTokenPayloadSchema>;
