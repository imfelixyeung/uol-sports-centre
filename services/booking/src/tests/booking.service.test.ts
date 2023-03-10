import {Booking} from '@prisma/client';
import bookingService from '@/services/booking.service';
import {prismaMock} from './mock/prisma';
import {
  bookingToDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from '@/dto/booking.dto';
import {PaginatedBookings} from '@/types/responses';

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

    const expectedResult: PaginatedBookings = {
      bookings: bookings.map(b => bookingToDTO(b)),
      metadata: {
        count: bookings.length,
        limit: 0,
        page: 1,
        pageCount: 1,
      },
    };

    // mock the prisma transaction
    prismaMock.$transaction.mockResolvedValue([bookings.length, bookings]);

    // test if the returned value from the booking service equals the mocked data
    const returnedBookings = await bookingService.get();
    await expect(returnedBookings).toEqual(expectedResult);
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

    const expectedResult: PaginatedBookings = {
      bookings: bookings.map(b => bookingToDTO(b)),
      metadata: {
        count: bookings.length,
        limit: 0,
        page: 1,
        pageCount: 1,
      },
    };

    // mock the prisma client
    prismaMock.$transaction.mockResolvedValue([bookings.length, bookings]);

    // test if the returned value from the booking service equals the mocked data
    await expect(bookingService.getUserBookings(1)).resolves.toEqual(
      expectedResult
    );
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

  test('update booking', async () => {
    const existingBooking: Booking = {
      id: 10,
      userId: 1,
      facilityId: 1,
      transactionId: 1,
      starts: new Date(),
      duration: 60,
      created: new Date(),
      updated: new Date(),
    };
    const update: UpdateBookingDTO = {
      id: 10,
      duration: 100000,
    };
    const expectedUpdate: Booking = {...existingBooking, ...update};

    prismaMock.booking.update.mockResolvedValue(expectedUpdate);

    await expect(bookingService.update(update)).resolves.toEqual(
      expectedUpdate
    );
  });
});
