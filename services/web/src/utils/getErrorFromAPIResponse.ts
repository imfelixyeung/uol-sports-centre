import {z} from 'zod';

const errorResponseSchema = z.object({
  data: z.object({
    success: z.boolean(),
    error: z.string(),
  }),
});

const getErrorFromAPIResponse = (response: unknown) => {
  const parsed = errorResponseSchema.safeParse(response);
  if (!parsed.success) return null;

  return parsed.data.data.error;
};

export default getErrorFromAPIResponse;
