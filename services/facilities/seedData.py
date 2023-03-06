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


# Idea for how to handle events. Give activities table a start time and a day,
# If an activity is every day it's day field is "everyday".
# If an activity doesn't have a specific start time then it's hourly?
# Finish time for an activity with a specific start time can be implied from duration

seedFacilities()
seedOpenTime()