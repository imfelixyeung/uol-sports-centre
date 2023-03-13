import os
import unittest
import json
from app import create_app
from app.database import db
from app.models.activity import Activity
from app.models.facility import Facility
from app.models.opentime import OpenTime
from app.createDictionaries import make_activity, make_facility, make_open_time

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


class FacilitiesTests(unittest.TestCase):

  def setUp(self):
    self.app = app.test_client()

    with app.app_context():
      db.create_all()

      facility_test_case = Facility(name="Football", capacity=20)
      open_time_test_case = OpenTime(day="Monday",
                                     opening_time=660,
                                     closing_time=990,
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

  ################## FACILITIES TESTS ##################
  def test_get_facility(self):
    with app.app_context():
      response = self.app.get("/facilities/1")

      expected_response = {
          "status": "ok",
          "facility": {
              "id": 1,
              "name": "Football",
              "capacity": 20
          }
      }

      response_data = json.loads(response.data)

      self.assertDictEqual(response_data, expected_response)

  def test_add_facility_success(self):
    with app.app_context():

      response = self.app.post("/facilities/",
                               json={
                                   "name": "Tennis Court",
                                   "capacity": int(6)
                               })

      check_query = Facility.query.get(2)

      check_data = make_facility(check_query)

      self.assertDictEqual({
          "id": 2,
          "name": "Tennis Court",
          "capacity": 6
      }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "facility added",
          "facility": check_data
      }

      self.assertDictEqual(response_data, expected_response)

  def test_add_facility_failed(self):
    with app.app_context():

      response = self.app.post("/facilities/",
                               json={
                                   "name": int(2),
                                   "capacity": str("yeah")
                               })

      self.assertDictEqual({
          "status": "Failed",
          "message": "Invalid input"
      }, json.loads(response.data))

  def test_update_facility(self):
    with app.app_context():
      response = self.app.put("/facilities/1",
                              json={
                                  "name": "Football Pitch",
                                  "capacity": 25
                              })

      check_query = Facility.query.get(1)

      check_data = make_facility(check_query)

      self.assertDictEqual({
          "id": 1,
          "name": "Football Pitch",
          "capacity": 25
      }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "facility updated",
          "facility": check_data
      }

      self.assertDictEqual(expected_response, response_data)

  def test_delete_facility(self):
    with app.app_context():
      # Get facility before deletion so we can check response later
      to_delete = Facility.query.get(1)

      response = self.app.delete("/facilities/1")

      expected_response = {
          "status": "ok",
          "message": "facility deleted",
          "facility": make_facility(to_delete)
      }

      self.assertDictEqual(expected_response, json.loads(response.data))

  ################## OPEN TIME TESTS ##################
  def test_get_open_time(self):
    with app.app_context():
      response = self.app.get("/times/1")

      expected_response = {
          "id": 1,
          "day": "Monday",
          "opening_time": 660,
          "closing_time": 990,
          "facility_id": 1
      }

      response_data = json.loads(response.data)

      self.assertDictEqual(response_data, expected_response)

  def test_add_open_time_success(self):
    with app.app_context():

      response = self.app.post("/times/",
                               json={
                                   "day": "monday",
                                   "opening_time": int(660),
                                   "closing_time": int(720),
                                   "facility_id": int(1)
                               })

      check_query = OpenTime.query.get(2)

      check_data = make_open_time(check_query)

      self.assertDictEqual(
          {
              "id": 2,
              "day": "monday",
              "opening_time": int(660),
              "closing_time": int(720),
              "facility_id": int(1)
          }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "Opening time added",
          "open_time": check_data
      }

      self.assertDictEqual(response_data, expected_response)

  def test_update_open_time(self):
    with app.app_context():
      response = self.app.put("/times/1",
                              json={
                                  "day": "Tuesday",
                                  "opening_time": 600,
                                  "closing_time": 930
                              })

      check_query = OpenTime.query.get(1)

      check_data = make_open_time(check_query)

      self.assertDictEqual(
          {
              "id": 1,
              "day": "Tuesday",
              "opening_time": 600,
              "closing_time": 930,
              "facility_id": 1
          }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "opening time updated",
          "open_time": check_data
      }

      self.assertDictEqual(expected_response, response_data)

  def test_delete_open_time(self):
    with app.app_context():
      # Get facility before deletion so we can check response later
      to_delete = OpenTime.query.get(1)

      response = self.app.delete("/times/1")

      expected_response = {
          "status": "ok",
          "message": "opening time deleted",
          "open_time": make_open_time(to_delete)
      }

      self.assertDictEqual(expected_response, json.loads(response.data))

  ################## ACTIVITY TESTS ##################
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

      self.assertDictEqual(response_data, expected_response)

  def test_add_activity_success(self):
    with app.app_context():

      response = self.app.post("/activities/",
                               json={
                                   "name": "Football Lesson",
                                   "duration": int(30),
                                   "capacity": int(20),
                                   "facility_id": int(1)
                               })

      check_query = Activity.query.get(2)

      check_data = make_activity(check_query)

      self.assertDictEqual(
          {
              "id": 2,
              "name": "Football Lesson",
              "duration": int(30),
              "capacity": int(20),
              "facility_id": int(1)
          }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "Activity added",
          "activity": check_data
      }

      self.assertDictEqual(response_data, expected_response)

  def test_update_activity(self):
    with app.app_context():
      response = self.app.put("/activities/1",
                              json={
                                  "name": "Football Lesson",
                                  "capacity": 10,
                                  "duration": 30
                              })

      check_query = Activity.query.get(1)

      check_data = make_activity(check_query)

      self.assertDictEqual(
          {
              "id": 1,
              "name": "Football Lesson",
              "capacity": 10,
              "duration": 30,
              "facility_id": 1
          }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "activity updated",
          "activity": check_data
      }

      self.assertDictEqual(expected_response, response_data)

  def test_delete_activity(self):
    with app.app_context():
      # Get facility before deletion so we can check response later
      to_delete = Activity.query.get(1)

      response = self.app.delete("/activities/1")

      expected_response = {
          "status": "ok",
          "message": "activity deleted",
          "activity": make_activity(to_delete)
      }

      self.assertDictEqual(expected_response, json.loads(response.data))


if __name__ == "__main__":
  unittest.main()
