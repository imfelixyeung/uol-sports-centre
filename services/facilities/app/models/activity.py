"""Model for the Activity table"""
from app.database import db


class Activity(db.Model):
  """Class to represent the model"""
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  duration = db.Column(db.Integer)  # Stored as ms
  capacity = db.Column(db.Integer)

  facility_id = db.Column(db.ForeignKey("facility.id"))
