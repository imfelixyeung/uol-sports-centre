import express from 'express';
import supertest from 'supertest';
import {Booking} from '@prisma/client';

import {createServer} from '@/server';
import {
  bookingToDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from '@/dto/booking.dto';

import {prismaMock} from './mock/prisma';
import {PaginatedBookings} from '@/types/responses';
import {Status} from '@/types';

let app: express.Express;

beforeAll(done => {
  app = createServer();
  done();
});

describe('Test API Endpoints', () => {
  test('GET /bookings', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        transactionId: 1,
        facilityId: 1,
        userId: 1,
        duration: 60,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
    ];

    const expectedResponseBody: PaginatedBookings & Status = {
      status: 'OK',
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

    // perform test to see if it is there
    await supertest(app)
      .get('/bookings')
      .expect(200)
      .then(response => {
        // check it returns what it should
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });

  test('GET /bookings?user=2', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        transactionId: 1,
        facilityId: 1,
        userId: 2,
        duration: 60,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
    ];

    const expectedResponseBody: PaginatedBookings & Status = {
      status: 'OK',
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

    // perform test to see if it is there
    await supertest(app)
      .get('/bookings')
      .query({user: 2})
      .expect(200)
      .then(response => {
        // check it returns what it should
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });

  test('GET /bookings/1', async () => {
    // create list of mock bookings
    const bookingMock: Booking = {
      id: 1,
      transactionId: 1,
      facilityId: 1,
      userId: 1,
      duration: 60,
      starts: new Date(),
      created: new Date(),
      updated: new Date(),
    };
    const expectedResponseBody = {
      status: 'OK',
      booking: bookingToDTO(bookingMock),
    };

    // mock the prisma client
    prismaMock.booking.findUnique.mockResolvedValue(bookingMock);

    // perform test to see if it is there
    await supertest(app)
      .get('/bookings/1')
      .expect(200)
      .then(response => {
        // check it returns what it should
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });

  test('POST /bookings', async () => {
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
    const expectedResponseBody = {
      status: 'OK',
      booking: bookingToDTO(mockBooking),
    };

    // mock the prisma client
    prismaMock.booking.create.mockResolvedValue(mockBooking);

    // create a new booking
    await supertest(app)
      .post('/bookings')
      .send(newBooking)
      .expect(200)
      .then(response => {
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });

  test('PUT /bookings/10', async () => {
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

    const expectedResponseBody = {
      status: 'OK',
      booking: bookingToDTO(expectedUpdate),
    };

    // mock the prisma client
    prismaMock.booking.update.mockResolvedValue(expectedUpdate);

    // create a new booking
    await supertest(app)
      .put('/bookings/10')
      .send(update)
      .expect(200)
      .then(response => {
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });
});
