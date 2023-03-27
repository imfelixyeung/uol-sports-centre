import {EventType} from '@prisma/client';

export interface EventDTO {
  id: number;
  name: string;
  activityId: number;
  day: number;
  time: number;
  duration: number;
  type: EventType;
}

export interface CreateEventDTO {
  name: string;
  activityId: number;
  day: number;
  time: number;
  duration: number;
  type: EventType;
}

export interface UpdateEventDTO {
  id: number;
  name?: string;
  activityId?: number;
  day?: number;
  time?: number;
  duration?: number;
  type?: EventType;
}
