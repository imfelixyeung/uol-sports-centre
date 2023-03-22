"""Module for testing the activities functions"""
import json
import unittest
import os
from app import create_app
from app.database import db
from app.models.facility import Facility
from app.models.activity import Activity
from app.create_dictionaries import make_activity

# Create app for testing
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

################# ACTIVITY TESTS ##################


class ActivitiesTests(unittest.TestCase):
  """Class for testing all API calls for the activities table"""

  def setUp(self):
    self.app = app.test_client()

    with app.app_context():
      db.create_all()

      facility_test_case = Facility(name="Football", capacity=20)
      activity_test_case = Activity(name="Swimming Lesson",
                                    duration=30,
                                    capacity=20,
                                    facility_id=1)
      db.session.add(facility_test_case)
      db.session.add(activity_test_case)
      db.session.commit()

  # Remove everything from database after tests are complete
  def tearDown(self):
    with app.app_context():
      db.session.remove()
      db.drop_all()


################# SUCCESS CASE TESTS ##################

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

  ################# FAIL CASE TESTS ##################

  def test_add_activity_wrong_data(self):
    with app.app_context():

      response = self.app.post("/activities/",
                               json={
                                   "name": int(30),
                                   "duration": str("Thirty"),
                                   "capacity": str("Twenty"),
                                   "facility_id": int(1)
                               })

      self.assertDictEqual({
          "status": "Failed",
          "message": "Invalid input"
      }, json.loads(response.data))
