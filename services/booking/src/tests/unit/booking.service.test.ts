import {Booking} from '@prisma/client';
import {mockReset} from 'jest-mock-extended';
import {prismaMock} from '../mock/prisma';
import {httpClientMock} from '../mock/httpClient';

import bookingService from '@/services/booking.service';
import {
  bookingToDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from '@/dto/booking.dto';
import {PaginatedBookings} from '@/types/responses';

beforeEach(() => {
  mockReset(prismaMock);
  mockReset(httpClientMock);
});
describe('Test BookingService', () => {
  test('get bookings', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        userId: 1,
        eventId: 1,
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
        eventId: 1,
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
    await expect(bookingService.getUserBookings({user: 1})).resolves.toEqual(
      expectedResult
    );
  });

  test('get booking by id', async () => {
    // create list of mock bookings
    const booking: Booking = {
      id: 1,
      userId: 1,
      eventId: 1,
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
      eventId: 1,
      starts: new Date(),
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
    expect(prismaMock.booking.create.mock.calls[0]![0]).toEqual({
      data: mockBookingWithoutId,
    });
  });

  test('update booking', async () => {
    const existingBooking: Booking = {
      id: 10,
      userId: 1,
      eventId: 1,
      starts: new Date(),
      created: new Date(),
      updated: new Date(),
    };
    const update: UpdateBookingDTO = {
      id: 10,
      eventId: 34,
    };
    const expectedUpdate: Booking = {...existingBooking, ...update};

    prismaMock.booking.update.mockResolvedValue(expectedUpdate);

    await expect(bookingService.update(update)).resolves.toEqual(
      expectedUpdate
    );
  });

  test('delete booking by id', async () => {
    const booking: Booking = {
      id: 100,
      userId: 1,
      eventId: 1,
      starts: new Date(),
      created: new Date(),
      updated: new Date(),
    };
    prismaMock.booking.delete.mockResolvedValue(booking);

    await expect(bookingService.deleteById(100)).resolves.toEqual(booking);
  });

  // Note that this test cannot be easily mocked, as it requires a real database
  // this is being tested in the integration tests instead
  // test('get available bookings', async () => {
  //   const event: EventDTO = {
  //     id: 4,
  //     name: 'Pool Open Use',
  //     activityId: 1,
  //     day: 3,
  //     time: 480,
  //     duration: 720,
  //     type: 'OPEN_USE',
  //   };

  //   const bookings: Booking[] = [];
  //   const expectedOutput: PossibleBookingDTO[] = [
  //     {
  //       starts: '2023-03-16T08:00:00.000Z',
  //       duration: 60,
  //       event: event,
  //       capacity: {current: 0, max: 15},
  //     },
  //     {
  //       starts: '2023-03-16T09:00:00.000Z',
  //       duration: 60,
  //       event: event,
  //       capacity: {current: 0, max: 15},
  //     },
  //   ];

  //   const activitiesRes: ActivitiesResponse = [
  //     {
  //       id: 1,
  //       name: 'Pool Open Use',
  //       facility_id: 1,
  //       capacity: 15,
  //       duration: 60,
  //     },
  //   ];

  //   // mock the event fetching
  //   prismaMock.event.findMany.mockResolvedValueOnce([event]);

  //   // mock the activity fetching
  //   httpClientMock.get.mockResolvedValue(activitiesRes);

  //   // mock the getBookings
  //   prismaMock.$transaction.mockResolvedValueOnce([1, bookings]);

  //   const availableBookings = await bookingService.getAvailableBookings({
  //     start: new Date('2023-03-16T08:00:00.000Z').getTime(),
  //     end: new Date('2023-03-16T10:00:00.000Z').getTime(),
  //   });

  //   // if (availableBookings instanceof Error) console.error(availableBookings);

  //   expect(availableBookings).toEqual(expectedOutput);
  // });

  test('get available bookings - db events error', async () => {
    prismaMock.event.findMany.mockRejectedValue(null);
    await expect(bookingService.getAvailableBookings()).resolves.toBeInstanceOf(
      Error
    );
  });
});
