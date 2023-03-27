import {EventDTO} from '@/dto/event.dto';
import request from 'supertest';

import {ADMIN_TOKEN, BASE_URL, USER_TOKEN, prisma} from './base';

function sortEvents(events: EventDTO[]) {
  return events.sort((a, b) => {
    const x = a.id;
    const y = b.id;
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

describe('Test GET /events', () => {
  it('should return events without authorisation', async () => {
    const response = await request(BASE_URL)
      .get('/events')
      .query({
        start: new Date('2023-03-14T08:00:00.000Z').getTime(),
        end: new Date('2023-03-14T10:00:00.000Z').getTime(),
      });

    expect(response.status).toBe(200);
  });

  it('should return events with authorisation', async () => {
    const response = await request(BASE_URL)
      .get('/events')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .query({
        start: new Date('2023-03-14T08:00:00.000Z').getTime(),
        end: new Date('2023-03-14T10:00:00.000Z').getTime(),
      });

    expect(response.status).toBe(200);
  });

  it('should return all events with no query params', async () => {
    const response = await request(BASE_URL)
      .get('/events')
      .set('Authorization', `Bearer ${USER_TOKEN}`);

    // get all events from db
    const events = await prisma.event.findMany();

    expect(response.status).toBe(200);
    expect(sortEvents(response.body.events)).toStrictEqual(sortEvents(events));
  });
});

describe('Test POST /events', () => {
  it('should return 400 if bad request', async () => {
    const response = await request(BASE_URL)
      .post('/events')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        type: 'SESSION',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 if not authorised', async () => {
    const response = await request(BASE_URL).post('/events').send({
      name: 'Test Event',
      activityId: '1',
      day: 1,
      time: 1,
      duration: 1,
      type: 'SESSION',
    });

    expect(response.status).toBe(401);
  });

  it('should return 403 if not admin', async () => {
    const response = await request(BASE_URL)
      .post('/events')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        name: 'Test Event',
        activityId: '1',
        day: 1,
        time: 1,
        duration: 1,
        type: 'SESSION',
      });

    expect(response.status).toBe(403);
  });

  it('should create an event if admin', async () => {
    const response = await request(BASE_URL)
      .post('/events')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        name: 'Test Event',
        activityId: '1',
        day: 1,
        time: 1,
        duration: 1,
        type: 'SESSION',
      });

    expect(response.status).toBe(200);
  });
});

describe('Test PUT /events/:id', () => {
  it('should return 400 if bad request', async () => {
    const response = await request(BASE_URL)
      .put('/events/1')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        type: ';q2heqwuhefuhqw[ouerf[aurouhq[iurhuhgiaueh[fouohq[ouh',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 if not authorised', async () => {
    const response = await request(BASE_URL).put('/events/1').send({
      name: 'Test Event',
      activityId: '1',
      day: 1,
      time: 1,
      duration: 1,
      type: 'SESSION',
    });

    expect(response.status).toBe(401);
  });

  it('should return 403 if not admin', async () => {
    const response = await request(BASE_URL)
      .put('/events/1')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({
        name: 'Test Event',
        activityId: '1',
        day: 1,
        time: 1,
        duration: 1,
        type: 'SESSION',
      });

    expect(response.status).toBe(403);
  });

  it('should update an event if admin', async () => {
    const response = await request(BASE_URL)
      .put('/events/1')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        name: 'Pool Party',
      });

    expect(response.status).toBe(200);
  });
});
