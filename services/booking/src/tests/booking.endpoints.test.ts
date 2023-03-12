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

describe('Test /bookings', () => {
  test('GET /bookings', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        transactionId: 1,
        eventId: 1,
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

  test('GET /bookings?limit=5&page=2', async () => {
    // create list of mock bookings
    const bookings: Booking[] = [
      {
        id: 1,
        transactionId: 1,
        eventId: 1,
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
        id: 6,
        transactionId: 1,
        eventId: 1,
        userId: 2,
        duration: 60,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
      {
        id: 7,
        transactionId: 1,
        eventId: 1,
        userId: 2,
        duration: 60,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
      {
        id: 8,
        transactionId: 1,
        eventId: 1,
        userId: 2,
        duration: 60,
        starts: new Date(),
        created: new Date(),
        updated: new Date(),
      },
    ];

    const bookingsCount = 100;
    const expectedResponseBody: PaginatedBookings & Status = {
      status: 'OK',
      bookings: bookings.map(b => bookingToDTO(b)),
      metadata: {
        count: bookingsCount,
        limit: 5,
        page: 2,
        pageCount: bookingsCount / 5,
      },
    };

    // mock the prisma client
    prismaMock.$transaction.mockResolvedValue([bookingsCount, bookings]);

    // perform test to see if it is there
    await supertest(app)
      .get('/bookings')
      .query({user: 2, limit: 5, page: 2})
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
      eventId: 1,
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
      eventId: 1,
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
      eventId: 1,
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

  test('DELETE /bookings/10', async () => {
    const booking: Booking = {
      id: 10,
      userId: 1,
      eventId: 1,
      transactionId: 1,
      starts: new Date(),
      duration: 60,
      created: new Date(),
      updated: new Date(),
    };

    const expectedResponseBody = {
      status: 'OK',
      booking: bookingToDTO(booking),
    };

    // mock the prisma client
    prismaMock.booking.delete.mockResolvedValue(booking);

    // create a new booking
    await supertest(app)
      .delete('/bookings/10')
      .expect(200)
      .then(response => {
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });

  //
  // The following tests send erroneous data
  //

  test('GET /bookings?limit=sdhkfs -- Bad params', async () => {
    await supertest(app)
      .get('/bookings')
      .query({limit: 'sdhkfs'})
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('GET /bookings -- Database error', async () => {
    prismaMock.$transaction.mockRejectedValue(null);

    await supertest(app)
      .get('/bookings')
      .expect(500)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });
  test('GET /bookings?user=1 -- Database error', async () => {
    prismaMock.$transaction.mockRejectedValue(null);

    await supertest(app)
      .get('/bookings')
      .query({user: 1})
      .expect(500)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('GET /bookings/hkfs -- Bad params', async () => {
    await supertest(app)
      .get('/bookings/sffs')
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('POST /bookings -- Bad body', async () => {
    await supertest(app)
      .post('/bookings')
      .send({hello: 'World'})
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('POST /bookings -- Database error', async () => {
    prismaMock.booking.create.mockRejectedValue(null);

    await supertest(app)
      .post('/bookings')
      .send({
        userId: 1,
        duration: 60,
        eventId: 1,
        starts: new Date(),
        transactionId: 1,
      } as CreateBookingDTO)
      .expect(500)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('GET /bookings/1 -- Database error', async () => {
    prismaMock.booking.findUnique.mockRejectedValue(null);

    await supertest(app)
      .get('/bookings/1')
      .expect(500)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('GET /bookings/1 -- Doesnt exist error', async () => {
    prismaMock.booking.findUnique.mockResolvedValue(null);

    await supertest(app)
      .get('/bookings/1')
      .expect(404)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('PUT /bookings/hkfs -- Bad params', async () => {
    await supertest(app)
      .put('/bookings/sffs')
      .send({
        starts: new Date(),
      } as UpdateBookingDTO)
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('PUT /bookings/1 -- Bad body', async () => {
    await supertest(app)
      .put('/bookings/1')
      .send({
        userId: new Date(),
      })
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('PUT /bookings/1 -- Database Error', async () => {
    prismaMock.booking.update.mockRejectedValue(null);

    await supertest(app)
      .put('/bookings/1')
      .send({
        userId: 1,
      } as UpdateBookingDTO)
      .expect(500)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('DELETE /bookings/1 -- Database Error', async () => {
    prismaMock.booking.delete.mockRejectedValue(null);

    await supertest(app)
      .delete('/bookings/1')
      .expect(500)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });

  test('DELETE /bookings/hjkf -- Bad params', async () => {
    await supertest(app)
      .delete('/bookings/hjkf')
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe('error');
        expect(response.body.error).toBeTruthy();
      });
  });
});
