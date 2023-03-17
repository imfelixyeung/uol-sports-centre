// This file is used to define the schema for the JWT token.
import {z} from 'zod';

export const jsonWebTokenSchema = z.string();

export type JsonWebToken = z.infer<typeof jsonWebTokenSchema>;
