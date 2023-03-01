import logging
from flask import Flask
from app import app

app.logger.info('index route request')

# API call to get a facility from the database based on ID
@app.route('/getFacility/<int:id>', methods=['GET', 'POST'])
def getFacility(id):
    return

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