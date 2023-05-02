import request from 'supertest';
import {Booking} from '@prisma/client';

import logger from '@/lib/logger';
import {bookingToDTO} from '@/dto/booking.dto';

import {
  prisma,
  BASE_URL,
  USER_TOKEN,
  EMPLOYEE_TOKEN,
  ADMIN_TOKEN,
} from './base';

const BOOKINGS: [
  Booking,
  Booking,
  Booking,
  Booking,
  Booking,
  Booking,
  Booking
] = [
  {
    id: 1,
    eventId: 1,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 2,
    eventId: 2,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 3,
    eventId: 3,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 4,
    eventId: 2,
    userId: 3,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 5,
    eventId: 1,
    userId: 4,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 6,
    eventId: 1,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 7,
    eventId: 1,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
];

beforeAll(async () => {
  await prisma.$connect();
  await prisma.booking.createMany({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: BOOKINGS.map(({id, ...remainder}) => remainder),
  });

  logger.debug('Created test bookings');
  logger.debug(`Bookings count: ${await prisma.booking.count()}`);
});

describe('Test GET /bookings endpoint', () => {
  it("should 400 if bad params are passed to 'limit' and 'page'", async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .query({
        limit: 'bad',
        page: 'bad',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if accessed without authentication', async () => {
    const response = await request(BASE_URL).get('/bookings');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if requests all bookings as user', async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if user requests all user bookings for another id', async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .query({user: 2})
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should return bookings for users own id', async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .query({user: 1})
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.bookings).toBeDefined();
    expect(response.body.bookings).toStrictEqual(
      BOOKINGS.filter(b => b.userId === 1).map(b => bookingToDTO(b))
    );
  });

  it('should return all bookings for employee', async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .set('Authorization', `Bearer ${EMPLOYEE_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.bookings).toBeDefined();
    expect(response.body.bookings).toStrictEqual(
      BOOKINGS.map(b => bookingToDTO(b))
    );
  });

  it('should return all bookings for admin', async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.bookings).toBeDefined();
    expect(response.body.bookings).toStrictEqual(
      BOOKINGS.map(b => bookingToDTO(b))
    );
    expect(response.body.metadata).toBeDefined();
  });

  it('should return 2 bookings per page', async () => {
    const response = await request(BASE_URL)
      .get('/bookings')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .query({
        limit: 2,
        page: 1,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.bookings).toBeDefined();
    expect(response.body.bookings).toHaveLength(2);
    expect(response.body.metadata).toBeDefined();
    expect(response.body.metadata.page).toBe(1);
    expect(response.body.metadata.limit).toBe(2);
    expect(response.body.metadata.count).toBe(BOOKINGS.length);
    expect(response.body.metadata.pageCount).toBe(
      Math.ceil(BOOKINGS.length / 2)
    );
  });
});

describe('Test POST /bookings endpoint', () => {
  it("should 400 if bad params are passed to 'add booking'", async () => {
    const response = await request(BASE_URL)
      .post('/bookings')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        userId: 'bad',
        eventId: 'bad',
        starts: 'bad',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if add booking without authentication', async () => {
    const response = await request(BASE_URL).post('/bookings').send({
      userId: 1,
      eventId: 1,
      starts: new Date(),
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if a user tries adding a booking', async () => {
    const response = await request(BASE_URL)
      .post('/bookings')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        userId: 1,
        eventId: 1,
        starts: new Date(),
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if an employee tries adding a booking', async () => {
    const response = await request(BASE_URL)
      .post('/bookings')
      .set('Authorization', `Bearer ${EMPLOYEE_TOKEN}`)
      .send({
        userId: 1,
        eventId: 1,
        starts: new Date(),
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should add a booking if is admin', async () => {
    const response = await request(BASE_URL)
      .post('/bookings')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        userId: 1,
        eventId: 1,
        starts: new Date(),
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});

describe('Test GET /bookings/:id endpoint', () => {
  it("should 400 if bad id is passed to 'get booking'", async () => {
    const response = await request(BASE_URL)
      .get('/bookings/bad')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if get booking without authentication', async () => {
    const response = await request(BASE_URL).get('/bookings/1');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should 403 for booking 4 (owned by uid 3) for user 1', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/4')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should 404 for booking 100 (not existing)', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/100')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('error');
  });

  it('should return booking 4 (owned by uid 3) for an employee (uid 5)', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/4')
      .set('Authorization', `Bearer ${EMPLOYEE_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[3]));
  });

  it('should return booking 4 (owned by uid 3) for an admin (uid 2)', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/4')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[3]));
  });

  it('should return booking 1 (owned by uid 1) for user 1', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/1')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[0]));
  });
});

describe('Test PUT /bookings/:id endpoint', () => {
  it("should 400 if bad body is passed to 'update booking'", async () => {
    const response = await request(BASE_URL)
      .put('/bookings/1')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        eventId: 'bad',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it("should 400 if bad url param is passed to 'update booking'", async () => {
    const response = await request(BASE_URL)
      .put('/bookings/bad')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        eventId: 3,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if update booking without authentication', async () => {
    const response = await request(BASE_URL).put('/bookings/1').send({
      eventId: 3,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if a user tries updating a booking', async () => {
    const response = await request(BASE_URL)
      .put('/bookings/1')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        eventId: 3,
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should 404 if update booking with non-existing id', async () => {
    const response = await request(BASE_URL)
      .put('/bookings/100')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        eventId: 3,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('error');
  });

  it('should update a booking if is employee', async () => {
    const response = await request(BASE_URL)
      .put('/bookings/1')
      .set('Authorization', `Bearer ${EMPLOYEE_TOKEN}`)
      .send({
        eventId: 3,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(
      bookingToDTO({
        ...BOOKINGS[0],
        eventId: 3,
      })
    );
  });

  it('should update a booking if is admin', async () => {
    const response = await request(BASE_URL)
      .put('/bookings/1')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        eventId: 3,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toStrictEqual(
      bookingToDTO({
        ...BOOKINGS[0],
        eventId: 3,
      })
    );
  });
});

describe('Test DELETE /bookings/:id endpoint', () => {
  it("should 400 if bad params are passed to 'delete booking'", async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/bad')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if delete booking without authentication', async () => {
    const response = await request(BASE_URL).delete('/bookings/1');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if a user tries deleting a booking that is not theirs', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/4')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should 404 if delete booking with non-existing id', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/100')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('error');
  });

  it('should delete booking if is employee', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/6')
      .set('Authorization', `Bearer ${EMPLOYEE_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[5]));
  });

  it('should delete booking if is admin', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/7')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[6]));
  });

  it('should delete booking if is user and is their own booking', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/2')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[1]));
  });
});

describe('Test GET /bookings/availability', () => {
  it('should 400 if bad params are passed to "get availability"', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/availability')
      .query({
        activity: 'bad',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it("should be accessible without authentication (it's public)", async () => {
    const response = await request(BASE_URL).get('/bookings/availability');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('should be accessible with authentication', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/availability')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('should return the same available bookings with and without start/end params for the same day', async () => {
    const availability = await request(BASE_URL).get('/bookings/availability');

    const availabilityWithTimeFilters = await request(BASE_URL)
      .get('/bookings/availability')
      .query({
        start: new Date().setHours(0, 0, 0, 0),
        end: new Date().setHours(23, 59, 59, 999),
      });

    expect(availability.statusCode).toBe(200);
    expect(availability.body.status).toBe('OK');
    expect(availability.body.availableBookings).toBeDefined();

    expect(availabilityWithTimeFilters.statusCode).toBe(200);
    expect(availabilityWithTimeFilters.body.status).toBe('OK');
    expect(availabilityWithTimeFilters.body.availableBookings).toBeDefined();

    expect(availability.body.availableBookings).toStrictEqual(
      availabilityWithTimeFilters.body.availableBookings
    );

    expect(availability.body.availableBookings[0].starts).toBeDefined();
    expect(availability.body.availableBookings[0].starts).toContain(
      new Date().toISOString().split('T')[0]
    );
  });

  it('should have more tests', async () => {});
});

describe('Test POST /bookings/book', () => {
  it('should 400 if bad body is passed to "book"', async () => {
    const response = await request(BASE_URL)
      .post('/bookings/book')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        activity: 'bad',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if book without authentication', async () => {
    const response = await request(BASE_URL).post('/bookings/book').send({
      user: 1,
      event: 1,
      starts: '2023-03-02T10:00:00.000Z',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
  });

  it('should 403 if a user tries booking a slot for another user', async () => {
    const response = await request(BASE_URL)
      .post('/bookings/book')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        user: 2,
        event: 1,
        starts: '2023-03-02T10:00:00.000Z',
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
  });

  it('should 404 if book with non-existing event', async () => {
    const response = await request(BASE_URL)
      .post('/bookings/book')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        user: 1,
        event: 100,
        starts: '2023-03-02T10:00:00.000Z',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('error');
  });

  it("should book a slot if it's available for a user", async () => {
    const response = await request(BASE_URL)
      .post('/bookings/book')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        user: 1,
        event: 1,
        starts: '2023-03-02T10:00:00.000Z',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking.id).toEqual(expect.any(Number));
    expect(response.body.booking.userId).toBe(1);
    expect(response.body.booking.eventId).toBe(1);
    expect(response.body.booking.starts).toBe('2023-03-02T10:00:00.000Z');
    expect(new Date(response.body.booking.created)).toBeInstanceOf(Date);
    expect(new Date(response.body.booking.updated)).toBeInstanceOf(Date);
  });

  it("should book a slot if it's available for an employee", async () => {
    const response = await request(BASE_URL)
      .post('/bookings/book')
      .set('Authorization', `Bearer ${EMPLOYEE_TOKEN}`)
      .send({
        user: 1,
        event: 1,
        starts: '2023-03-02T10:00:00.000Z',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking.id).toEqual(expect.any(Number));
    expect(response.body.booking.userId).toBe(1);
    expect(response.body.booking.eventId).toBe(1);
    expect(response.body.booking.starts).toBe('2023-03-02T10:00:00.000Z');
    expect(new Date(response.body.booking.created)).toBeInstanceOf(Date);
    expect(new Date(response.body.booking.updated)).toBeInstanceOf(Date);
  });

  it("should book a slot if it's available for an admin", async () => {
    const response = await request(BASE_URL)
      .post('/bookings/book')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        user: 1,
        event: 1,
        starts: '2023-03-02T10:00:00.000Z',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking.id).toEqual(expect.any(Number));
    expect(response.body.booking.userId).toBe(1);
    expect(response.body.booking.eventId).toBe(1);
    expect(response.body.booking.starts).toBe('2023-03-02T10:00:00.000Z');
    expect(new Date(response.body.booking.created)).toBeInstanceOf(Date);
    expect(new Date(response.body.booking.updated)).toBeInstanceOf(Date);
  });

  it('should have more tests', async () => {});
});
