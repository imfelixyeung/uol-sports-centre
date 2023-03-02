import logging, json
from flask import Flask
from app import app, db, models, admin
from .models import Facility, OpenTime, Activity
from flask_admin.contrib.sqla import ModelView

app.logger.info('index route request')

admin.add_view(ModelView(Facility, db.session))
admin.add_view(ModelView(OpenTime, db.session))
admin.add_view(ModelView(Activity, db.session))

################# FACILITIES API CALLS #################

# API call to get a facility from the database based on ID
@app.route('/facility/<int:id>', methods=['GET', 'POST'])
def getFacility(id):    
    facilityQuery = models.Facility.query.get(id)

    facilityID = facilityQuery.id
    facilityName = facilityQuery.name
    facilityCapacity = facilityQuery.capacity

    returnValue = {
        "id": facilityID,
        "name": facilityName,
        "capacity": facilityCapacity
    }

    return json.dumps(returnValue)

# API call to return the name of every facility with its related ID
@app.route('/getAllFacilities', methods=['GET', 'POST'])
def getAllFacilities():
    strtest = "yeah"
    return strtest

# API call to update a facility based on ID
@app.route('/updateFacility/<int:id>', methods=['GET', 'POST'])
def updateFacility(id):
    return

# API call to add a facility to the database
@app.route('/addFacility', methods=['GET', 'POST'])
def addFacility():
    return

################# OPENING TIMES API CALLS #################

# API call to get an opening time by ID
@app.route('/time/<int:id>', methods=['GET', 'POST'])
def getOpeningTime(id):
    openTimeQuery = models.OpenTime.query.get(id)

    openTimeID = openTimeQuery.id
    Day = openTimeQuery.day
    Open = openTimeQuery.openingTime
    Close = openTimeQuery.closingTime
    facilityID = openTimeQuery.facility_id

    returnValue = {
        "id": openTimeID,
        "Day": Day,
        "Open Time": Open,
        "Close Time": Close,
        "Facility ID": facilityID
    }

    return json.dumps(returnValue)

################# ACTIVITY API CALLS #################

# API call to get an opening time by ID
@app.route('/activity/<int:id>', methods=['GET', 'POST'])
def getActivity(id):
    activityQuery = models.Activity.query.get(id)

    activityID = activityQuery.id
    duration = activityQuery.duration
    capacity = activityQuery.capacity
    facilityID = activityQuery.facility_id

    returnValue = {
        "id": activityID,
        "Duration": duration,
        "Capacity": capacity,
        "Facility ID": facilityID
    }

    return json.dumps(returnValue)