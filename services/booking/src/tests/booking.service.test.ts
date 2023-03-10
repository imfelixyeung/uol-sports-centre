import {Booking} from '@prisma/client';
import bookingService from '@/services/booking.service';
import {prismaMock} from './mock/prisma';
import {CreateBookingDTO} from '@/dto/booking.dto';

describe('Test BookingService', () => {
  test('get bookings', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        userId: 1,
        facilityId: 1,
        transactionId: 1,
        duration: 100,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
    ];

    // mock the prisma client
    prismaMock.booking.findMany.mockResolvedValue(bookings);

    // test if the returned value from the booking service equals the mocked data
    await expect(bookingService.get()).resolves.toEqual(bookings);
  });

  test('get booking for specific user', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        userId: 1,
        facilityId: 1,
        transactionId: 1,
        duration: 100,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
    ];

    // mock the prisma client
    prismaMock.booking.findMany.mockResolvedValue(bookings);

    // test if the returned value from the booking service equals the mocked data
    await expect(bookingService.getUserBookings(1)).resolves.toEqual(bookings);
  });

  test('get booking by id', async () => {
    // create list of mock bookings
    const booking: Booking = {
      id: 1,
      userId: 1,
      facilityId: 1,
      transactionId: 1,
      duration: 100,
      starts: new Date(),
      created: new Date(),
      updated: new Date(),
    };
    // mock the prisma client
    prismaMock.booking.findUnique.mockResolvedValue(booking);

    // test if the returned value from the booking service equals the mocked data
    await expect(bookingService.getById(1)).resolves.toEqual(booking);
  });

  test('create booking', async () => {
    // test data
    const newBooking: CreateBookingDTO = {
      userId: 1,
      facilityId: 1,
      transactionId: 1,
      starts: new Date(),
      duration: 60,
    };
    const mockBooking: Booking = {
      ...newBooking,
      id: 1,
      created: new Date(),
      updated: new Date(),
    };

    // mock the prisma client
    prismaMock.booking.create.mockResolvedValue(mockBooking);

    // run the booking service create
    await expect(
      bookingService.create(newBooking)
    ).resolves.toStrictEqual<Booking>(mockBooking);

    // first argument of the first call to create
    // we consume the id here (aka we don't need it)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id: _, ...mockBookingWithoutId} = mockBooking;
    expect(prismaMock.booking.create.mock.calls[0][0]).toEqual({
      data: mockBookingWithoutId,
    });
  });
});
