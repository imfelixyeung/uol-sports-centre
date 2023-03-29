"""Module for testing the open time functions"""
import json
import unittest
import os
from app import create_app
from app.database import db
from app.models.facility import Facility
from app.models.opentime import OpenTime
from app.create_dictionaries import make_open_time
from create_test_token import create_test_token

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

################## OPEN TIME TESTS ##################


class OpenTimeTests(unittest.TestCase):
  """Class for testing all API calls for the open times table"""

  def setUp(self):
    self.app = app.test_client()

    with app.app_context():
      db.create_all()

      facility_test_case = Facility(name="Football",
                                    capacity=20,
                                    description="A great football pitch")
      open_time_test_case = OpenTime(day="Monday",
                                     opening_time=660,
                                     closing_time=990,
                                     facility_id=1)
      db.session.add(facility_test_case)
      db.session.add(open_time_test_case)
      db.session.commit()

  # Remove everything from database after tests are complete
  def tearDown(self):
    with app.app_context():
      db.session.remove()
      db.drop_all()

  ################## SUCCESS CASE TESTS ##################
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

      token = create_test_token()
      response = self.app.post("/times/",
                               json={
                                   "day": "monday",
                                   "opening_time": int(660),
                                   "closing_time": int(720),
                                   "facility_id": int(1)
                               },
                               headers={"Authorization": f"Bearer {token}"})

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

      token = create_test_token()

      response = self.app.put("/times/1",
                              json={
                                  "day": "Tuesday",
                                  "opening_time": 600,
                                  "closing_time": 930
                              },
                              headers={"Authorization": f"Bearer {token}"})

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

      token = create_test_token()

      # Get facility before deletion so we can check response later
      to_delete = OpenTime.query.get(1)

      response = self.app.delete("/times/1",
                                 headers={"Authorization": f"Bearer {token}"})

      expected_response = {
          "status": "ok",
          "message": "opening time deleted",
          "open_time": make_open_time(to_delete)
      }

      self.assertDictEqual(expected_response, json.loads(response.data))

  ################# FAIL CASE TESTS ##################

  def test_add_open_time_wrong_data(self):
    with app.app_context():

      token = create_test_token()

      response = self.app.post("/times/",
                               json={
                                   "day": int(2),
                                   "opening_time": str("7:30"),
                                   "closing_time": str("10:30pm"),
                                   "facility_id": int(1)
                               },
                               headers={"Authorization": f"Bearer {token}"})

      self.assertDictEqual({
          "status": "Failed",
          "message": "Invalid input"
      }, json.loads(response.data))

  def test_permission_denied(self):
    with app.app_context():

      token = create_test_token(role="USER")

      response = self.app.post("/times/",
                               json={
                                   "name": "Tennis Court",
                                   "capacity": int(6),
                                   "description": "A tennis court"
                               },
                               headers={"Authorization": f"Bearer {token}"})

      self.assertDictEqual({
          "status": "Failed",
          "message": "Permission denied"
      }, json.loads(response.data))
