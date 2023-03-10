import express from 'express';
import supertest from 'supertest';
import {Booking} from '@prisma/client';

import {createServer} from '@/server';
import {CreateBookingDTO} from '@/dto/booking.dto';

import {prismaMock} from './mock/prisma';

let app: express.Express;

beforeAll(done => {
  app = createServer();
  done();
});

describe('Test API Endpoints', () => {
  test('GET /bookings', async () => {
    // create list of mock bookings
    const bookingsMock: Booking[] = [
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

    const expectedResponseBody = {
      status: 'OK',
      bookings: bookingsMock.map(booking => {
        return {
          ...booking,
          starts: booking.starts.toISOString(),
          created: booking.created.toISOString(),
          updated: booking.updated.toISOString(),
        };
      }),
    };

    // mock the prisma client
    prismaMock.booking.findMany.mockResolvedValue(bookingsMock);

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
    const bookingsMock: Booking[] = [
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

    const expectedResponseBody = {
      status: 'OK',
      bookings: bookingsMock.map(booking => {
        return {
          ...booking,
          starts: booking.starts.toISOString(),
          created: booking.created.toISOString(),
          updated: booking.updated.toISOString(),
        };
      }),
    };

    // mock the prisma client
    prismaMock.booking.findMany.mockResolvedValue(bookingsMock);

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
      booking: {
        ...bookingMock,
        starts: bookingMock.starts.toISOString(),
        created: bookingMock.created.toISOString(),
        updated: bookingMock.updated.toISOString(),
      },
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
      booking: {
        id: 1,
        userId: 1,
        facilityId: 1,
        transactionId: 1,
        duration: 60,
        starts: new Date().toISOString(),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      },
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
});
