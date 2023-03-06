from app.database import db


class Facility(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  capacity = db.Column(db.Integer)

  # Foreign Connectors for the Facilities table
  open_times = db.relationship('OpenTime', backref='facility')
  activities = db.relationship('Activity', backref='facility')
