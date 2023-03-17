import express from 'express';
import supertest from 'supertest';
import {Event} from '@prisma/client';

import {createServer} from '@/server';

import {prismaMock} from './mock/prisma';
import {Status} from '@/types';
import {EventDTO} from '@/dto/event.dto';

let app: express.Express;

beforeAll(done => {
  app = createServer();
  done();
});

describe('Test /events', () => {
  test('GET /events', async () => {
    // create list of mock events
    const events: Event[] = [
      {
        id: 1,
        name: 'Pool Open Use',
        activityId: 1,
        day: 1,
        time: 480,
        duration: 720,
        type: 'OPEN_USE',
      },
      {
        id: 2,
        name: 'Fitness Open Use',
        activityId: 5,
        day: 1,
        time: 480,
        duration: 840,
        type: 'OPEN_USE',
      },
    ];

    const expectedResponseBody: {events: EventDTO[]} & Status = {
      status: 'OK',
      events: events,
    };

    // mock the prisma client
    prismaMock.event.findMany.mockResolvedValue(events);

    // perform test to see if it is there
    await supertest(app)
      .get('/events')
      .query({
        start: new Date('2023-03-14T08:00:00.000Z').getTime(),
        end: new Date('2023-03-14T10:00:00.000Z').getTime(),
      })
      .expect(200)
      .then(response => {
        // check it returns what it should
        expect(response.body).toStrictEqual(expectedResponseBody);
      });
  });
});
