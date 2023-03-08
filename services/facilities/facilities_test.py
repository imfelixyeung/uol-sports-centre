import os
import unittest
import json
from app import create_app
from app.database import db
from app.models.activity import Activity
from app.models.facility import Facility
from app.models.opentime import OpenTime
from app.createDictionaries import makeActivity, makeFacility, makeOpenTime

basedir = os.path.abspath(os.path.dirname(__file__))
app = create_app(testing=True,
                 config={
                     "SQLALCHEMY_DATABASE_URI":
                         "sqlite:///" + os.path.join(basedir, "test.db"),
                     "TESTING":
                         True,
                     "WTF_CSRF_ENABLED":
                         False
                 })


class facilitiesTests(unittest.TestCase):
  # Set up tests for facilities API
  def setUp(self):
    self.app = app.test_client()

    with app.app_context():
      db.create_all()
      facility_test_case = Facility(name="Football", capacity=20)
      open_time_test_case = OpenTime(day="Monday",
                                     openingTime=660,
                                     closingTime=990,
                                     facility_id=1)
      activity_test_case = Activity(name="Swimming Lesson",
                                    duration=30,
                                    capacity=20,
                                    facility_id=1)
      db.session.add(facility_test_case)
      db.session.add(open_time_test_case)
      db.session.add(activity_test_case)
      db.session.commit()

  # Remove everything from database after tests are complete
  def tearDown(self):
    with app.app_context():
      db.session.remove()
      db.drop_all()

  def test_get_facility(self):
    with app.app_context():
      response = self.app.get("/facilities/1")

      expected_response = {"id": 1, "name": "Football", "capacity": 20}

      response_data = json.loads(response.data)

      self.assertEqual(response_data, expected_response)

  def test_get_open_time(self):
    with app.app_context():
      response = self.app.get("/times/1")

      expected_response = {
          "id": 1,
          "day": "Monday",
          "openTime": 660,
          "closeTime": 990,
          "facility_id": 1
      }

      response_data = json.loads(response.data)

      self.assertEqual(response_data, expected_response)

  def test_get_activity(self):
    with app.app_context():
      response = self.app.get("/activities/1")

      expected_response = {
          "id": 1,
          "name": "Swimming Lesson",
          "duration": 30,
          "capacity": 20,
          "facility_id": 1
      }

      response_data = json.loads(response.data)

      self.assertEqual(response_data, expected_response)

  def test_add_facility_success(self):
    with app.app_context():

      response = self.app.post("/facilities/",
                               json={
                                   "name": "Tennis Court",
                                   "capacity": int(6)
                               })

      checkQuery = Facility.query.get(2)

      checkData = makeFacility(checkQuery)

      self.assertEqual({
          "id": 2,
          "name": "Tennis Court",
          "capacity": 6
      }, checkData)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "facility added",
          "facility": checkData
      }

      self.assertEqual(response_data, expected_response)

  def test_add_facility_failed(self):
    with app.app_context():

      response = self.app.post("/facilities/",
                               json={
                                   "name": int(2),
                                   "capacity": str("yeah")
                               })

      self.assertEqual({
          "status": "Failed",
          "message": "Invalid input"
      }, json.loads(response.data))

  def test_add_openTime_success(self):
    with app.app_context():

      response = self.app.post("/times/",
                               json={
                                   "day": "monday",
                                   "openTime": int(660),
                                   "closeTime": int(720),
                                   "facility_id": int(1)
                               })

      checkQuery = OpenTime.query.get(2)

      checkData = makeOpenTime(checkQuery)

      self.assertEqual(
          {
              "id": 2,
              "day": "monday",
              "openTime": int(660),
              "closeTime": int(720),
              "facility_id": int(1)
          }, checkData)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "Opening time added",
          "facility": checkData
      }

      self.assertEqual(response_data, expected_response)

  def test_add_activity_success(self):
    with app.app_context():

      response = self.app.post("/activities/",
                               json={
                                   "name": "Football Lesson",
                                   "duration": int(30),
                                   "capacity": int(20),
                                   "facility_id": int(1)
                               })

      checkQuery = Activity.query.get(2)

      checkData = makeActivity(checkQuery)

      self.assertEqual(
          {
              "id": 2,
              "name": "Football Lesson",
              "duration": int(30),
              "capacity": int(20),
              "facility_id": int(1)
          }, checkData)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "Activity added",
          "facility": checkData
      }

      self.assertEqual(response_data, expected_response)


if __name__ == "__main__":
  unittest.main()
