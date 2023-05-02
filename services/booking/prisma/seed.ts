import {Prisma, PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

enum KnownActivities {
  PoolOpenUse = 1,
  PoolLaneSwim,
  PoolLesson,
  PoolTeamEvent,
  FitnessOpenUse,
  SquashCourt1Session,
  SquashCourt2Session,
  SportsHallSession,
  SportsHallTeamEvent,
  ClimbingWallOpenUse,
  StudioExerciseClass,
}

async function main() {
  if ((await prisma.event.count()) > 0) {
    console.log('Already contains events');
    return;
  }

  ///////////////////
  // Swimming Pool //
  ///////////////////

  const poolEvents: Prisma.EventCreateInput[] = [];

  // Mon 8am - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 0,
    time: 8 * 60, // 8am
    duration: 12 * 60, // 12hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 0,
    time: 8 * 60, // 8am
    duration: 12 * 60, // 12hrs
    type: 'OPEN_USE',
  });

  // Tue 8am - 2pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 1,
    time: 8 * 60, // 8am
    duration: 6 * 60, // 6hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 1,
    time: 8 * 60, // 8am
    duration: 6 * 60, // 6hrs
    type: 'OPEN_USE',
  });

  // Tue 2pm - 4pm
  poolEvents.push({
    activityId: KnownActivities.PoolLesson,
    name: 'Pool Lesson',
    day: 1,
    time: 14 * 60, // 2pm
    duration: 2 * 60, // 2hrs
    type: 'OPEN_USE',
  });

  // Tue 4pm - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 1,
    time: 16 * 60, // 4pm
    duration: 4 * 60, // 4hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 1,
    time: 16 * 60, // 4pm
    duration: 4 * 60, // 4hrs
    type: 'OPEN_USE',
  });

  // Wed 8am - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 2,
    time: 8 * 60, // 8am
    duration: 12 * 60, // 12hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 2,
    time: 8 * 60, // 8am
    duration: 12 * 60, // 12hrs
    type: 'OPEN_USE',
  });

  // Thu 8am - 2pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 3,
    time: 8 * 60, // 8am
    duration: 6 * 60, // 6hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 3,
    time: 8 * 60, // 8am
    duration: 6 * 60, // 6hrs
    type: 'OPEN_USE',
  });

  // Thu 2pm - 4pm
  poolEvents.push({
    activityId: KnownActivities.PoolLesson,
    name: 'Pool Lesson',
    day: 3,
    time: 14 * 60, // 2pm
    duration: 2 * 60, // 2hrs
    type: 'OPEN_USE',
  });

  // Thu 4pm - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 3,
    time: 16 * 60, // 4pm
    duration: 4 * 60, // 4hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 3,
    time: 16 * 60, // 4pm
    duration: 4 * 60, // 4hrs
    type: 'OPEN_USE',
  });

  // Fri 8am-10am
  poolEvents.push({
    activityId: KnownActivities.PoolTeamEvent,
    name: 'Pool Team Event',
    day: 4,
    time: 8 * 60, // 8am
    duration: 2 * 60, // 2hrs
    type: 'TEAM_EVENT',
  });

  // Fri 10am - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 4,
    time: 10 * 60, // 10am
    duration: 10 * 60, // 10hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 4,
    time: 10 * 60, // 10am
    duration: 10 * 60, // 10hrs
    type: 'OPEN_USE',
  });

  // Sat 8am - 2pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 5,
    time: 8 * 60, // 8am
    duration: 6 * 60, // 6hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 5,
    time: 8 * 60, // 8am
    duration: 6 * 60, // 6hrs
    type: 'OPEN_USE',
  });

  // Sat 2pm - 4pm
  poolEvents.push({
    activityId: KnownActivities.PoolLesson,
    name: 'Pool Lesson',
    day: 5,
    time: 14 * 60, // 2pm
    duration: 2 * 60, // 2hrs
    type: 'OPEN_USE',
  });

  // Sat 4pm - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 5,
    time: 16 * 60, // 4pm
    duration: 4 * 60, // 4hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 5,
    time: 16 * 60, // 4pm
    duration: 4 * 60, // 4hrs
    type: 'OPEN_USE',
  });

  // Sun 8am-10am
  poolEvents.push({
    activityId: KnownActivities.PoolTeamEvent,
    name: 'Pool Team Event',
    day: 6,
    time: 8 * 60, // 8am
    duration: 2 * 60, // 2hrs
    type: 'TEAM_EVENT',
  });

  // Sun 10am - 8pm
  poolEvents.push({
    activityId: KnownActivities.PoolOpenUse,
    name: 'Pool Open Use',
    day: 6,
    time: 10 * 60, // 10am
    duration: 10 * 60, // 10hrs
    type: 'OPEN_USE',
  });

  poolEvents.push({
    activityId: KnownActivities.PoolLaneSwim,
    name: 'Pool Lane Swimming',
    day: 6,
    time: 10 * 60, // 10am
    duration: 10 * 60, // 10hrs
    type: 'OPEN_USE',
  });

  await prisma.event.createMany({
    data: poolEvents,
  });

  //////////////////
  // Fitness Room //
  //////////////////

  const fitnessRoomEvents: Prisma.EventCreateInput[] = [];

  for (let day = 0; day < 7; day++) {
    fitnessRoomEvents.push({
      activityId: KnownActivities.FitnessOpenUse,
      day,
      name: 'Fitness Open Use',
      time: 8 * 60, // 8am
      duration: 14 * 60, // 14hrs
      type: 'OPEN_USE',
    });
  }

  await prisma.event.createMany({
    data: fitnessRoomEvents,
  });

  ///////////////////
  // Squash Courts //
  ///////////////////

  const squashEvents: Prisma.EventCreateInput[] = [];

  for (let day = 0; day < 7; day++) {
    squashEvents.push({
      activityId: KnownActivities.SquashCourt1Session,
      day,
      name: 'Squash Court 1 Session',
      time: 8 * 60, // 8am
      duration: 14 * 60, // 14hrs
      type: 'SESSION',
    });

    squashEvents.push({
      activityId: KnownActivities.SquashCourt2Session,
      day,
      name: 'Squash Court 2 Session',
      time: 8 * 60, // 8am
      duration: 14 * 60, // 14hrs
      type: 'SESSION',
    });
  }

  await prisma.event.createMany({
    data: squashEvents,
  });

  /////////////////
  // Sports Hall //
  /////////////////

  const sportsHallEvents: Prisma.EventCreateInput[] = [];

  // Mon, Tue, Wed 8am - 10pm
  for (let day = 0; day < 3; day++) {
    sportsHallEvents.push({
      activityId: KnownActivities.SportsHallSession,
      day,
      name: 'Sports Hall Session',
      time: 8 * 60, // 8am
      duration: 14 * 60, // 14hrs
      type: 'SESSION',
    });
  }

  // Thu 8am - 7pm
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallSession,
    day: 3,
    name: 'Sports Hall Session',
    time: 8 * 60, // 8am
    duration: 11 * 60, // 11 hrs
    type: 'SESSION',
  });

  // Thu 7pm - 9pm
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallTeamEvent,
    day: 3,
    name: 'Sports Hall Team Event',
    time: 19 * 60, // 7pm
    duration: 2 * 60, // 2 hrs
    type: 'TEAM_EVENT',
  });

  // Thu 9pm - 10pm
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallSession,
    day: 3,
    name: 'Sports Hall Session',
    time: 21 * 60, // 9pm
    duration: 1 * 60, // 1 hr
    type: 'SESSION',
  });

  // Fri 8am - 10pm
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallTeamEvent,
    day: 4,
    name: 'Sports Hall Session',
    time: 8 * 60, // 8am
    duration: 14 * 60, // 14 hrs
    type: 'SESSION',
  });

  // Sat 8am - 9am
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallSession,
    day: 5,
    name: 'Sports Hall Session',
    time: 8 * 60, // 8am
    duration: 1 * 60, // 1 hr
    type: 'SESSION',
  });

  // Sat 9am - 11am
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallTeamEvent,
    day: 5,
    name: 'Sports Hall Team Event',
    time: 9 * 60, // 9am
    duration: 2 * 60, // 2 hrs
    type: 'TEAM_EVENT',
  });

  // Sat 11am - 10pm
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallSession,
    day: 5,
    name: 'Sports Hall Session',
    time: 11 * 60, // 11am
    duration: 11 * 60, // 11 hrs
    type: 'SESSION',
  });

  // Sun 8am - 10pm
  sportsHallEvents.push({
    activityId: KnownActivities.SportsHallSession,
    day: 6,
    name: 'Sports Hall Session',
    time: 8 * 60, // 8am
    duration: 14 * 60, // 14 hrs
    type: 'SESSION',
  });

  await prisma.event.createMany({
    data: sportsHallEvents,
  });

  ///////////////////
  // Climbing Wall //
  ///////////////////

  const wallEvents: Prisma.EventCreateInput[] = [];

  for (let day = 0; day < 7; day++) {
    wallEvents.push({
      activityId: KnownActivities.ClimbingWallOpenUse,
      day,
      name: 'Climbing Wall Open Use',
      time: 10 * 60, // 10am
      duration: 12 * 60, // 12hrs
      type: 'OPEN_USE',
    });
  }

  await prisma.event.createMany({
    data: wallEvents,
  });

  /////////////////////////////
  // Studio Exercise Classes //
  /////////////////////////////

  const studioEvents: Prisma.EventCreateInput[] = [
    {
      activityId: KnownActivities.StudioExerciseClass,
      name: 'Pilates Class',
      day: 0, // Mon
      time: 18 * 60, // 6pm
      duration: 1 * 60, // 1hr
      type: 'OPEN_USE',
    },
    {
      activityId: KnownActivities.StudioExerciseClass,
      name: 'Aerobics Class',
      day: 1, // Tue
      time: 10 * 60, // 10am
      duration: 1 * 60, // 1hr
      type: 'OPEN_USE',
    },
    {
      activityId: KnownActivities.StudioExerciseClass,
      name: 'Aerobics Class',
      day: 3, // Thu
      time: 19 * 60, // 7pm
      duration: 1 * 60, // 1hr
      type: 'OPEN_USE',
    },
    {
      activityId: KnownActivities.StudioExerciseClass,
      name: 'Aerobics Class',
      day: 5, // Sat
      time: 10 * 60, // 10am
      duration: 1 * 60, // 1hr
      type: 'OPEN_USE',
    },
    {
      activityId: KnownActivities.StudioExerciseClass,
      name: 'Yoga Class',
      day: 4, // Fri
      time: 19 * 60, // 7pm
      duration: 1 * 60, // 1hr
      type: 'OPEN_USE',
    },
    {
      activityId: KnownActivities.StudioExerciseClass,
      name: 'Yoga Class',
      day: 6, // Sun
      time: 9 * 60, // 9am
      duration: 1 * 60, // 1hr
      type: 'OPEN_USE',
    },
  ];

  await prisma.event.createMany({
    data: studioEvents,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    throw new Error(e);
  });
