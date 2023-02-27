from flask import Flask
from app import app

# API call to get a facility from the database based on ID
@app.route('/getFacility/<int:id>', methods=['GET', 'POST'])
def getFacility(id):
    return

# API call to update a facility based on ID
@app.route('/updateFacility/<int:id>', methods=['GET', 'POST'])
def updateFacility(id):
    return
