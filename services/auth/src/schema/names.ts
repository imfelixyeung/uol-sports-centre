import {z} from 'zod';

export const nameSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type Name = z.infer<typeof nameSchema>;
