import {z} from 'zod';

export const healthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded']),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
