"""Module for testing the facilities functions"""
import json
import unittest
import os
from app import create_app
from app.database import db
from app.models.facility import Facility
from app.create_dictionaries import make_facility
from create_test_token import create_test_token

############ FACILITIES TESTS ############

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
  """Class for testing all API calls for the facilities table"""

  def setUp(self):
    self.app = app.test_client()

    with app.app_context():
      db.create_all()

      facility_test_case = Facility(name="Football",
                                    capacity=20,
                                    description="A football pitch")
      db.session.add(facility_test_case)
      db.session.commit()

  # Remove everything from database after tests are complete
  def tearDown(self):
    with app.app_context():
      db.session.remove()
      db.drop_all()

  ################## SUCCESS CASE TESTS ##################
  def test_get_facility_success(self):
    with app.app_context():
      response = self.app.get("/facilities/1")

      expected_response = {
          "status": "ok",
          "facility": {
              "id": 1,
              "name": "Football",
              "capacity": 20,
              "description": "A football pitch"
          }
      }

      response_data = json.loads(response.data)

      self.assertDictEqual(response_data, expected_response)

  def test_add_facility_success(self):
    with app.app_context():
      token = create_test_token()

      response = self.app.post("/facilities/",
                               json={
                                   "name": "Tennis Court",
                                   "capacity": int(6),
                                   "description": "A tennis court"
                               },
                               headers={"Authorization": f"Bearer {token}"})

      check_query = Facility.query.get(2)

      check_data = make_facility(check_query)

      self.assertDictEqual(
          {
              "id": 2,
              "name": "Tennis Court",
              "capacity": 6,
              "description": "A tennis court"
          }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "facility added",
          "facility": check_data
      }

      self.assertDictEqual(response_data, expected_response)

  def test_update_facility_success(self):
    with app.app_context():
      token = create_test_token()

      response = self.app.put("/facilities/1",
                              json={
                                  "name": "Football Pitch",
                                  "capacity": 25,
                                  "description": "A great football pitch"
                              },
                              headers={"Authorization": f"Bearer {token}"})

      check_query = Facility.query.get(1)

      check_data = make_facility(check_query)

      self.assertDictEqual(
          {
              "id": 1,
              "name": "Football Pitch",
              "capacity": 25,
              "description": "A great football pitch"
          }, check_data)

      response_data = json.loads(response.data)

      expected_response = {
          "status": "ok",
          "message": "facility updated",
          "facility": check_data
      }

      self.assertDictEqual(expected_response, response_data)

  def test_delete_facility_success(self):
    with app.app_context():
      token = create_test_token()

      # Get facility before deletion so we can check response later
      to_delete = Facility.query.get(1)

      response = self.app.delete("/facilities/1",
                                 headers={"Authorization": f"Bearer {token}"})

      expected_response = {
          "status": "ok",
          "message": "facility deleted",
          "facility": make_facility(to_delete)
      }

      self.assertDictEqual(expected_response, json.loads(response.data))

  ################## FAIL CASE TESTS ##################

  def test_add_facility_wrong_data(self):
    with app.app_context():
      token = create_test_token()

      response = self.app.post("/facilities/",
                               json={
                                   "name": int(2),
                                   "capacity": str("yeah")
                               },
                               headers={"Authorization": f"Bearer {token}"})

      self.assertDictEqual({
          "status": "Failed",
          "message": "Invalid input"
      }, json.loads(response.data))

  def test_permission_denied(self):
    with app.app_context():

      token = create_test_token(role="USER")

      response = self.app.post("/facilities/",
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
