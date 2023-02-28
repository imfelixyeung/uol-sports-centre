import express from 'express';
import supertest from 'supertest';
import {createServer} from '../src/index';

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
    await supertest(app).get('/bookings').expect(200);
    // .then(response => {
    //   // Check type and length
    //   expect(Array.isArray(response.body)).toBeTruthy();
    //   expect(response.body.length).toEqual(1);

    //   // Check data matches with the record we added
    //   // expect(response.body[0]._id).toBe(booking.id);
    // });
  });
});
