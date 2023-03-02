import os
import unittest
import json
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import app, db, models

class facilitiesTests(unittest.TestCase):
    # Set up tests for facilities API
    def setUp(self):
        app.config.from_object('config')
        app.config["TESTING"] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///testing/test.db'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()
            facilityTestCase = models.Facility(name="Football", capacity=20)
            db.session.add(facilityTestCase)
            db.session.commit()

    # Remove everything from database after tests are complete
    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_facility(self):
       with app.app_context():
          response = self.app.get('/facility/1')

          expectedResponse = {
              "id": 1, 
              "name": "Football", 
              "capacity": 20
          }

          responseData = json.loads(response.data)
        
          self.assertEqual(responseData, expectedResponse)

    def test_add_facility(self):
        with app.app_context():

            response = self.app.post('/addFacility', json={
                "name": "Tennis Court", "capacity": int(6)
                })

            # check = self.app.get('/facility/2')

            # checkData = json.loads(check.data)

            checkQuery = models.Facility.query.get(2)
            facilityID = checkQuery.id
            facilityName = checkQuery.name
            facilityCapacity = checkQuery.capacity

            checkData =  {
                "id": facilityID,
                "name": facilityName,
                "capacity": facilityCapacity
                }

            self.assertEqual({"id": 2, "name": "Tennis Court", "capacity": 6}, checkData)

if __name__ == '__main__':
    unittest.main()
