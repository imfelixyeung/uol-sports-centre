"""Module to place data into app.db if data does not already exist"""
from app.models import Facility, OpenTime, Activity
from app import create_app
from app.database import db

app = create_app()


def seed_facilities():
  with app.app_context():
    seed_check = Facility.query.all()

    if not seed_check:
      swimming_pool = Facility(name="Swimming Pool",
                               capacity=30,
                               description="A swimming pool fit for 30 people.")
      fitness_room = Facility(
          name="Fitness Room",
          capacity=35,
          description="A suite that can answer all your fitness needs.")
      squash_court1 = Facility(name="Squash Court 1",
                               capacity=4,
                               description="First of two squash courts.")
      squash_court2 = Facility(name="Squash Court 2",
                               capacity=4,
                               description="Second of two squash courts.")
      sports_hall = Facility(
          name="Sports Hall",
          capacity=45,
          description="A large sports hall to accomodate for many activities.")
      climbing_hall = Facility(
          name="Climbing Wall",
          capacity=22,
          description=
          "A wall featuring a range of obstacles and varying difficulty levels."
      )
      studio = Facility(
          name="Studio",
          capacity=25,
          description=
          "A studio featuring a wide range of classes for your fitness needs.")
      db.session.add(swimming_pool)
      db.session.add(fitness_room)
      db.session.add(squash_court1)
      db.session.add(squash_court2)
      db.session.add(sports_hall)
      db.session.add(climbing_hall)
      db.session.add(studio)
      db.session.commit()


def seed_open_time():
  with app.app_context():
    seed_check = OpenTime.query.all()

    days = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
        "Sunday"
    ]

    if not seed_check:
      for day in days:
        swimming_time = OpenTime(day=day,
                                 opening_time=480,
                                 closing_time=1200,
                                 facility_id=1)
        fitness_room_time = OpenTime(day=day,
                                     opening_time=480,
                                     closing_time=1320,
                                     facility_id=2)
        squash_court_1_time = OpenTime(day=day,
                                       opening_time=480,
                                       closing_time=1320,
                                       facility_id=3)
        squash_court_2_time = OpenTime(day=day,
                                       opening_time=480,
                                       closing_time=1320,
                                       facility_id=4)
        sports_hall_time = OpenTime(day=day,
                                    opening_time=480,
                                    closing_time=1320,
                                    facility_id=5)
        climbing_wall_time = OpenTime(day=day,
                                      opening_time=600,
                                      closing_time=1200,
                                      facility_id=6)
        studio_time = OpenTime(day=day,
                               opening_time=480,
                               closing_time=1320,
                               facility_id=7)
        db.session.add(swimming_time)
        db.session.add(fitness_room_time)
        db.session.add(squash_court_1_time)
        db.session.add(squash_court_2_time)
        db.session.add(sports_hall_time)
        db.session.add(climbing_wall_time)
        db.session.add(studio_time)
      db.session.commit()


def seed_activities():
  with app.app_context():
    seed_check = Activity.query.all()

    if not seed_check:
      general_use = Activity(name="Swimming Pool Open Use",
                             duration=60,
                             capacity=27,
                             facility_id=1)
      lane_swimming = Activity(name="Lane Swimming",
                               duration=60,
                               capacity=3,
                               facility_id=1)
      lessons = Activity(name="Lessons",
                         duration=60,
                         capacity=30,
                         facility_id=1)
      team_event_swimming = Activity(name="Swimming Pool Team event",
                                     duration=120,
                                     capacity=30,
                                     facility_id=1)
      fitness_general = Activity(name="Fitness Room General Use",
                                 duration=60,
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
                                     duration=60,
                                     capacity=45,
                                     facility_id=5)
      sports_hall_team_event = Activity(name="Sports Hall Team Event",
                                        duration=120,
                                        capacity=45,
                                        facility_id=5)
      climbing_wall_general = Activity(name="Climbing Wall General Use",
                                       duration=60,
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


seed_facilities()
seed_open_time()
seed_activities()
