import {z} from 'zod';

export const id = (description: string) =>
  z
    .string()
    .transform(uid => parseInt(uid))
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
