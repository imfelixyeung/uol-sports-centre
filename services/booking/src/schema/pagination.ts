import {z} from 'zod';

export const limit = z
  .string()
  .transform(limit => parseInt(limit))
  .refine(limit => !Number.isNaN(limit), {
    message: 'Non-numeric limit parameter supplied',
  })
  .optional();

export const page = z
  .string()
  .transform(page => parseInt(page))
  .refine(page => !Number.isNaN(page), {
    message: 'Non-numeric page parameter supplied',
  })
  .optional();

export default {
  page,
  limit,
};
