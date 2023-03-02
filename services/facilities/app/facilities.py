import logging, json
from createDictionaries import *
from flask import Flask, request
from app import app, db, models, admin
from .models import Facility, OpenTime, Activity
from flask_admin.contrib.sqla import ModelView

app.logger.info('index route request')

admin.add_view(ModelView(Facility, db.session))
admin.add_view(ModelView(OpenTime, db.session))
admin.add_view(ModelView(Activity, db.session))

################# FACILITIES API CALLS #################

# API call to get a facility from the database based on ID
@app.route('/facility/<int:id>', methods=['GET'])
def getFacility(id):    
    facilityQuery = models.Facility.query.get(id)

    if(not facilityQuery):
        returnValue = {
            "status": "error",
            "message": "resource not found"
        }

    else:
        returnValue = makeFacility(facilityQuery)

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
@app.route('/facilities', methods=['POST'])
def addFacility():
    # Get data from body of post request
    data = json.loads(request.data)
    facilityName = data.get("name")
    facilityCapacity = int(data.get("capacity"))

    # Add the supplied object to the data base
    addition = models.Facility(name=facilityName, capacity=facilityCapacity)
    db.session.add(addition)
    db.session.commit()

    # Return the status of the addition and the object added to the database
    returnValue = {
        "status": "ok",
        "message": "facility added",
        "facility": makeFacility(addition)
    }

    return json.dumps(returnValue)

################# OPENING TIMES API CALLS #################

# API call to get an opening time by ID
@app.route('/time/<int:id>', methods=['GET'])
def getOpeningTime(id):
    openTimeQuery = models.OpenTime.query.get(id)

    returnValue = makeOpenTime(openTimeQuery)

    return json.dumps(returnValue)

# API call to add opening time to table
@app.route('/times', methods=['POST'])
def addOpeningTime():
    # Get data from body of post request
    data = json.loads(request.data)

    # Check that the supplied foreign key existss
    if(not models.Facility.query.get(int(data.get("facilityID")))):
        return json.dumps({"status": "failed", "message": "facility not found"})
    
    # Add the supplied object to the data base
    addition = models.OpenTime(day=data.get("day"), 
                               openingTime=data.get("openTime"), 
                               closingTime=data.get("closeTime"),
                               facility_id=data.get("facilityID"))
    db.session.add(addition)
    db.session.commit()

    # Return the status of the addition and the object added to the database
    returnValue = {
        "status": "ok",
        "message": "Opening time added",
        "facility": makeOpenTime(addition)
    }

    return json.dumps(returnValue)


################# ACTIVITY API CALLS #################

# API call to get an opening time by ID
@app.route('/activity/<int:id>', methods=['GET'])
def getActivity(id):
    activityQuery = models.Activity.query.get(id)

    returnValue = makeActivity(activityQuery)

    return json.dumps(returnValue)

# API call to add opening time to table
@app.route('/activities', methods=['POST'])
def addActivity():
    # Get data from body of post request
    data = json.loads(request.data)

    # Check that the supplied foreign key existss
    if(not models.Facility.query.get(int(data.get("facilityID")))):
        return json.dumps({"status": "failed", "message": "facility not found"})
    
    # Add the supplied object to the data base
    addition = models.Activity(duration=data.get("duration"),
                               capacity=data.get("capacity"),
                               facility_id=data.get("facilityID"))
    db.session.add(addition)
    db.session.commit()

    if(not addition):
        return json.dumps({"status": "failed", "message": "activity not added"})

    # Return the status of the addition and the object added to the database
    returnValue = {
        "status": "ok",
        "message": "Opening time added",
        "facility": makeActivity(addition)
    }

    return json.dumps(returnValue)