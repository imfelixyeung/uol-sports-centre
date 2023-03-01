import os
import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import app, db, models

class facilitiesTests(unittest.TestCase):
    # Set up tests for facilities API
    def setUp(self):
        app.config.from_object('config')
        app.config["TESTING"] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()

    # Remove everything from database after tests are complete
    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_addtaskroute(self):
       with app.app_context():
          response = self.app.get('/getAllFacilities')

          print("response Code: ", response.status_code)

          self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
