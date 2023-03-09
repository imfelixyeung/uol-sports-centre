from app.models import Facility, OpenTime, Activity
from app import create_app
from app.database import db

app = create_app()


def seedFacilities():
  with app.app_context():
    seedCheck = Facility.query.get(1)

    if (not seedCheck):
      swimmingPool = Facility(name="Swimming Pool", capacity=30)
      fitnessRoom = Facility(name="Fitness Room", capacity=35)
      squashCourt1 = Facility(name="Squash Court 1", capacity=4)
      squashCourt2 = Facility(name="Squash Court 2", capacity=4)
      sportsHall = Facility(name="Sports Hall", capacity=45)
      climbingWall = Facility(name="Climbing Wall", capacity=22)
      studio = Facility(name="Studio", capacity=25)
      db.session.add(swimmingPool)
      db.session.add(fitnessRoom)
      db.session.add(squashCourt1)
      db.session.add(squashCourt2)
      db.session.add(sportsHall)
      db.session.add(climbingWall)
      db.session.add(studio)
      db.session.commit()


def seedOpenTime():
  with app.app_context():
    seedCheck = OpenTime.query.get(1)

    days = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
        "Sunday"
    ]

    if (not seedCheck):
      for day in days:
        swimmingTime = OpenTime(day=day,
                                openingTime=480,
                                closingTime=1200,
                                facility_id=1)
        fitnessRoomTime = OpenTime(day=day,
                                   openingTime=480,
                                   closingTime=1320,
                                   facility_id=2)
        squashCourt1Time = OpenTime(day=day,
                                    openingTime=480,
                                    closingTime=1320,
                                    facility_id=3)
        squashCourt2Time = OpenTime(day=day,
                                    openingTime=480,
                                    closingTime=1320,
                                    facility_id=4)
        sportsHallTime = OpenTime(day=day,
                                  openingTime=480,
                                  closingTime=1320,
                                  facility_id=5)
        climbingWallTime = OpenTime(day=day,
                                    openingTime=600,
                                    closingTime=1200,
                                    facility_id=6)
        studioTime = OpenTime(day=day,
                              openingTime=480,
                              closingTime=1320,
                              facility_id=7)
        db.session.add(swimmingTime)
        db.session.add(fitnessRoomTime)
        db.session.add(squashCourt1Time)
        db.session.add(squashCourt2Time)
        db.session.add(sportsHallTime)
        db.session.add(climbingWallTime)
        db.session.add(studioTime)
      db.session.commit()


def seedActivities():
  with app.app_context():
    seed_check = Activity.query.get(1)

    if not seed_check:
      general_use = Activity(name="Swimming Pool Open Use",
                             duration=720,
                             capacity=15,
                             facility_id=1)
      lane_swimming = Activity(name="Lane Swimming",
                               duration=720,
                               capacity=15,
                               facility_id=1)
      lessons = Activity(name="Lessons",
                         duration=60,
                         capacity=20,
                         facility_id=1)
      team_event_swimming = Activity(name="Swimming Pool Team event",
                                     duration=120,
                                     capacity=30,
                                     facility_id=1)
      fitness_general = Activity(name="Fitness Room General Use",
                                 duration=840,
                                 capacity=35,
                                 facility_id=2)
      squash_court_1_session = Activity(name="Squash Court 1 Session",
                                        duration=60,
                                        capacity=4,
                                        facility_id=3)
      squash_court_2_session = Activity(name="Squash Court 2 Session",
                                        duration=60,
                                        capacity=4,
                                        facility_id=4)
      sports_hall_session = Activity(name="Sports hall Session",
                                     duration=840,
                                     capacity=45,
                                     facility_id=5)
      sports_hall_team_event = Activity(name="Sports Hall Team Event",
                                        duration=120,
                                        capacity=45,
                                        facility_id=5)
      climbing_wall_general = Activity(name="Climbing Wall General Use",
                                       duration=600,
                                       capacity=22,
                                       facility_id=6)
      exercise_class = Activity(name="Exercise Class",
                                duration=60,
                                capacity=25,
                                facility_id=7)
      db.session.add(general_use)
      db.session.add(lane_swimming)
      db.session.add(lessons)
      db.session.add(team_event_swimming)
      db.session.add(fitness_general)
      db.session.add(squash_court_1_session)
      db.session.add(squash_court_2_session)
      db.session.add(sports_hall_session)
      db.session.add(sports_hall_team_event)
      db.session.add(climbing_wall_general)
      db.session.add(exercise_class)
      db.session.commit()


seedFacilities()
seedOpenTime()
seedActivities()