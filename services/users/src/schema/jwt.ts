import {z} from 'zod';

export const jsonWebTokenSchema = z.string();

export type JsonWebToken = z.infer<typeof jsonWebTokenSchema>;
