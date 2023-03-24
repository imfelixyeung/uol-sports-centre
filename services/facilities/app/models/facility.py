"""Model for the facilities table"""
from app.database import db


class Facility(db.Model):
  """Class to represent the model"""
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  capacity = db.Column(db.Integer)
  description = db.Column(db.String(1024))

  # Foreign Connectors for the Facilities table
  open_times = db.relationship('OpenTime',
                               backref='facility',
                               cascade='all, delete')
  activities = db.relationship('Activity',
                               backref='facility',
                               cascade='all, delete')
