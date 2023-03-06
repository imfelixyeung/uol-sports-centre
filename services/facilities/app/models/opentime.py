from app.database import db


class OpenTime(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  day = db.Column(db.String(10))

  # The openingTime and closingTime fields are stored as minutes after midnight.
  # For example: if "football" opened at 11:30am the opening time would be stored as 690
  openingTime = db.Column(db.Integer)
  closingTime = db.Column(db.Integer)

  # Foreign Connectors for the OpenTimes table
  facility_id = db.Column(db.ForeignKey("facility.id"))
