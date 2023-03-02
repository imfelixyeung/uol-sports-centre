import {z} from 'zod';

const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
});

const getErrorFromAPIResponse = (response: unknown) => {
  const parsed = errorResponseSchema.safeParse(response);
  if (!parsed.success) return null;

  return parsed.data.error;
};

export default getErrorFromAPIResponse;
