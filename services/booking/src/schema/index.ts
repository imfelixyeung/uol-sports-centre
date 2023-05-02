import {z} from 'zod';

export const id = (description: string) =>
  z.coerce
    .number()
    .gt(0)
    .refine(uid => !Number.isNaN(uid), {
      message: `Non-numeric ${description} supplied`,
    });

export const date = z.coerce.date();

export const timestamp = z
  .string()
  .transform(timestamp => parseInt(timestamp))
  .refine(timestamp => !Number.isNaN(timestamp), {
    message: 'Non-numeric timestamp supplied',
  });
