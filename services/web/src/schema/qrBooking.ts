import {z} from 'zod';

export const qrBookingSchema = z.object({
  bookingIds: z.array(z.number()),
  userId: z.number(),
});

export type QrBooking = z.infer<typeof qrBookingSchema>;
