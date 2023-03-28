import dayjs from 'dayjs';

export const datesBetween = (_start: Date, _end: Date) => {
  const start = dayjs(_start)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);
  const end = dayjs(_end);

  const dates: Date[] = [];

  for (let date = start; date.isBefore(end); date = date.add(1, 'day'))
    dates.push(date.toDate());

  return dates;
};
