import request from 'supertest';
import jwt from 'jsonwebtoken';
import {Booking, PrismaClient} from '@prisma/client';

import {env} from '@/env';
import {UserRole} from '@/middleware/auth';
import logger from '@/lib/logger';
import {bookingToDTO} from '@/dto/booking.dto';

const prisma = new PrismaClient();

const BASE_URL = 'http://booking-server';
const USER_TOKEN = jwt.sign(
  {
    user: {
      id: 1,
      email: 'test@test.com',
      role: UserRole.USER,
    },
    type: 'access',
  },
  env.JWT_SIGNING_SECRET,
  {
    algorithm: 'HS256',
    issuer: 'auth',
  }
);
const ADMIN_TOKEN = jwt.sign(
  {
    user: {
      id: 2,
      email: 'admin@test.com',
      role: UserRole.ADMIN,
    },
    type: 'access',
  },
  env.JWT_SIGNING_SECRET,
  {
    algorithm: 'HS256',
    issuer: 'auth',
  }
);

const BOOKINGS: Booking[] = [
  {
    id: 1,
    transactionId: 1,
    eventId: 1,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 2,
    transactionId: 2,
    eventId: 2,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 3,
    transactionId: 3,
    eventId: 3,
    userId: 1,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 4,
    transactionId: 12,
    eventId: 2,
    userId: 3,
    starts: new Date('2023-03-27T10:00:00.000Z'),
    created: new Date(),
    updated: new Date(),
  },
  {
    id: 5,
    transactionId: 45,
    eventId: 1,
    userId: 4,
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
        transactionId: 'bad',
        starts: 'bad',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should 401 if add booking without authentication', async () => {
    const response = await request(BASE_URL).post('/bookings').send({
      userId: 1,
      eventId: 1,
      transactionId: 1,
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
        transactionId: 1,
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
        transactionId: 1,
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

  it('should return booking 4 (owned by uid 3) for an admin (uid 2)', async () => {
    const response = await request(BASE_URL)
      .get('/bookings/4')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.booking).toBeDefined();
    expect(response.body.booking).toStrictEqual(bookingToDTO(BOOKINGS[3]));
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

  it('should update a booking if is admin', async () => {
    const response = await request(BASE_URL)
      .put('/bookings/1')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        eventId: 3,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
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

  it('should 403 if a user tries deleting a booking', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/1')
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

  it('should delete booking if is admin', async () => {
    const response = await request(BASE_URL)
      .delete('/bookings/1')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});
