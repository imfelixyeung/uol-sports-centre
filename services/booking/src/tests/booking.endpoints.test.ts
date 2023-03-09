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
    const date = new Date();
    const bookingsMock: Booking[] = [
      {
        id: 1,
        transactionId: 1,
        facilityId: 1,
        userId: 1,
        duration: 60,
        starts: date,
        created: date,
        updated: date,
      },
    ];

    const expectedResponseBody = {
      status: 'OK',
      bookings: [
        {
          id: 1,
          transactionId: 1,
          facilityId: 1,
          userId: 1,
          duration: 60,
          starts: date.toISOString(),
          created: date.toISOString(),
          updated: date.toISOString(),
        },
      ],
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

  test('POST /bookings', async () => {
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
    const expectedResponseBody = {
      status: 'OK',
      booking: {
        id: 1,
        userId: 1,
        facilityId: 1,
        transactionId: 1,
        duration: 60,
        starts: date.toISOString(),
        created: date.toISOString(),
        updated: date.toISOString(),
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
