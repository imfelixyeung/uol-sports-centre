"""
Testing structure reference
Thoma, M. 2020. How to Test Flask Applications. Medium. 
URL: https://medium.com/analytics-vidhya/how-to-test-flask-applications-aef12ae5181c
"""
import pytest
import os
from app import create_app
from app.database import db
from app.models.activity import Activity
from app.models.facility import Facility
from app.models.opentime import OpenTime


@pytest.fixture
def client():
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

  test_client = app.test_client()
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

  yield test_client
