from app import db

# Model for the Facilities table
class Facility(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    capacity = db.Column(db.Integer)

    # Foreign Connectors for the Facilities table
    openTimes = db.relationship('OpenTime', backref='facility', lazy='dynamic')
    activities = db.relationship('Activity', backref='facility', lazy='dynamic')

# Model for the OpenTime table
# The openingTime and closingTime fields are stored as minutes after midnight.
# For example: if "football" opened at 11:30am the opening time would be stored as 690
class OpenTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(10))
    openingTime = db.Column(db.Integer)
    closingTime = db.Column(db.Integer)

    # Foreign Connectors for the OpenTimes table
    facility_id = db.Column(db.Integer, db.ForeignKey('facility.id'))

# Model for the Activity table
# The duration field is stored as mileseconds to help with communication to other microservices
class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    duration = db.Column(db.Integer)
    capacity = db.Column(db.Integer)

    # Foreign Connectors for the Activity table
    facility_id = db.Column(db.Integer, db.ForeignKey('facility.id'))
    

