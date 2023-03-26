import request from 'supertest';

import {ADMIN_TOKEN, BASE_URL, USER_TOKEN} from './base';

describe('Test GET /events', () => {
  test('it should return events without authorisation', async () => {
    const response = await request(BASE_URL)
      .get('/events')
      .query({
        start: new Date('2023-03-14T08:00:00.000Z').getTime(),
        end: new Date('2023-03-14T10:00:00.000Z').getTime(),
      });

    expect(response.status).toBe(200);
  });

  test('it should return events with authorisation', async () => {
    const response = await request(BASE_URL)
      .get('/events')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .query({
        start: new Date('2023-03-14T08:00:00.000Z').getTime(),
        end: new Date('2023-03-14T10:00:00.000Z').getTime(),
      });

    expect(response.status).toBe(200);
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
