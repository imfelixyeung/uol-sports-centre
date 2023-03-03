import os
import unittest
import json
from app import create_app
from app.database import db
from app.models.activity import Activity
from app.models.facility import Facility
from app.models.opentime import OpenTime
from app.createDictionaries import makeActivity, makeFacility, makeOpenTime
import os


basedir = os.path.abspath(os.path.dirname(__file__))
app = create_app(testing=True, config={
    "SQLALCHEMY_DATABASE_URI": 'sqlite:///' + os.path.join(basedir, 'test.db'),
    "TESTING": True,
    "WTF_CSRF_ENABLED": False
    })

class facilitiesTests(unittest.TestCase):
    # Set up tests for facilities API
    def setUp(self):
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()
            facilityTestCase = Facility(name="Football", capacity=20)
            db.session.add(facilityTestCase)
            db.session.commit()

    # Remove everything from database after tests are complete
    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_facility(self):
       with app.app_context():
          response = self.app.get('/facilities/1')

          expectedResponse = {
              "id": 1, 
              "name": "Football", 
              "capacity": 20
          }

          responseData = json.loads(response.data)
        
          self.assertEqual(responseData, expectedResponse)

    def test_add_facility(self):
        with app.app_context():

            response = self.app.post('/facilities/', json={
                "name": "Tennis Court", "capacity": int(6)
                })

            checkQuery = Facility.query.get(2)

            checkData =  {
                "id": checkQuery.id,
                "name": checkQuery.name,
                "capacity": checkQuery.capacity
                }

            self.assertEqual({"id": 2, "name": "Tennis Court", "capacity": 6}, checkData)
            
            responseData = json.loads(response.data)
            
            expectedResponse = {
                "status": "ok",
                "message": "facility added",
                "facility": checkData
            }

            self.assertEqual(responseData, expectedResponse)

    def test_add_openTime_success(self):
        with app.app_context():

            response = self.app.post('/times/', json={
                "day": "monday", "openTime": int(660), "closeTime": int(720), "facilityID": int(1)
                })

            checkQuery = OpenTime.query.get(1)

            checkData =  {
                "id": checkQuery.id,
                "day": checkQuery.day,
                "openTime": checkQuery.openingTime,
                "closeTime": checkQuery.closingTime,
                "facilityID": checkQuery.facility_id
            }

            self.assertEqual({"id": 1, "day": "monday", "openTime": int(660), "closeTime": int(720), "facilityID": int(1)}, checkData)
            
            responseData = json.loads(response.data)
            
            expectedResponse = {
                "status": "ok",
                "message": "Opening time added",
                "facility": checkData
            }

            self.assertEqual(responseData, expectedResponse)

    def test_add_activity(self):
        with app.app_context():

            response = self.app.post('/activities/', json={
                "duration": int(30), "capacity": int(20), "facilityID": int(1)
                })

            checkQuery = Activity.query.get(1)

            checkData =  {
                "id": checkQuery.id,
                "duration": checkQuery.duration,
                "capacity": checkQuery.capacity,
                "facilityID": checkQuery.facility_id
                }

            self.assertEqual({"id": 1, "duration": int(30), "capacity": int(20), "facilityID": int(1)}, checkData)
            
            responseData = json.loads(response.data)
            
            expectedResponse = {
                "status": "ok",
                "message": "Opening time added",
                "facility": checkData
            }

            self.assertEqual(responseData, expectedResponse)

if __name__ == '__main__':
    unittest.main()
