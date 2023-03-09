import {Booking} from '@prisma/client';
import bookingService from '@/services/booking.service';
import {prismaMock} from './mock/prisma';
import {CreateBookingDTO} from '@/dto/booking.dto';

describe('Test BookingService', () => {
  test('get bookings', async () => {
    // create list of mock bookings
    const date = new Date();
    const bookings: Booking[] = [
      {
        id: 1,
        userId: 1,
        facilityId: 1,
        transactionId: 1,
        duration: 100,
        starts: date,
        created: date,
        updated: date,
      },
    ];

    // mock the prisma client
    prismaMock.booking.findMany.mockResolvedValue(bookings);

    // test if the returned value from the booking service equals the mocked data
    await expect(bookingService.get()).resolves.toEqual(bookings);
  });

  test('create booking', async () => {
    // test data
    const date = new Date();
    const newBooking: CreateBookingDTO = {
      userId: 1,
      facilityId: 1,
      transactionId: 1,
      starts: date,
      duration: 60,
    };
    const mockBooking: Booking = {
      ...newBooking,
      id: 1,
      created: date,
      updated: date,
    };

    // mock the prisma client
    prismaMock.booking.create.mockResolvedValue(mockBooking);

    // run the booking service create
    await expect(bookingService.create(newBooking)).resolves.toEqual(
      mockBooking
    );

    // first argument of the first call to create
    // we consume the id here (aka we don't need it)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id: _, ...mockBookingWithoutId} = mockBooking;
    expect(prismaMock.booking.create.mock.calls[0][0]).toEqual({
      data: mockBookingWithoutId,
    });
  });
});
