import express from 'express';
import supertest from 'supertest';
import {createServer} from '../src/server';

let app: express.Express;

beforeAll(done => {
  app = createServer();
  done();
});

describe('Test', () => {
  test('GET /bookings', async () => {
    // manually add booking to test db
    // TODO: ~~~add booking~~~

    // perform test to see if it is there
    await supertest(app)
      .get('/bookings')
      .expect(200)
      .then(response => {
        // check it returns what it should
        expect(response.body.status).toEqual('OK');
        expect(Array.isArray(response.body.bookings)).toBeTruthy();

        // TODO: Check data matches with the record we added
        // expect(response.body.bookings.length).toEqual(1);
        // expect(response.body.bookings[0].id).toBe(booking.id);
      });
  });

  test('POST /bookings', async () => {
    // create a new booking
    await supertest(app)
      .post('/bookings')
      .send({
        userId: 9999,
        facilityId: 9999,
        transactionId: 9999,
        startTime: new Date().toUTCString(),
        duration: 9999,
      })
      .expect(200)
      .then(response => {
        expect(response.body.status).toEqual('OK');

        // expect it to return a booking
        expect(response.body.booking).toBeTruthy();
        expect(response.body.booking.id).toBeTruthy();
        expect(response.body.booking.userId).toBeTruthy();
        expect(response.body.booking.facilityId).toBeTruthy();
        expect(response.body.booking.transactionId).toBeTruthy();
        expect(response.body.booking.startTime).toBeTruthy();
        expect(response.body.booking.duration).toBeTruthy();
      });
  });
});
