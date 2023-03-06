from app.database import db


class Activity(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  duration = db.Column(db.Integer)  # Stored as ms
  capacity = db.Column(db.Integer)

  facility_id = db.Column(db.ForeignKey("facility.id"))
