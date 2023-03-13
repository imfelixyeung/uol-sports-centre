"""Management Microservice: 
Provides functionality for management-level access 
to the booking system"""
import stripe
from flask import Flask, request
import os
import sys
import sqlite3

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

def initDatabase():
    '''Initialise database from schema'''
    connection = sqlite3.connect('database.db')
    with open('services/management/managementSchema.sql') as schema:
        connection.executescript(schema.read())
    connection.close()

def setDiscount(discountAmount):
    '''Sets specified discount for subscriptions
    discountAmount: discount percentage for membership'''

def setPrice(newPrice, productName):
    '''Sets a price for memberships
    newPrice: price to be set'''

#To be coupled with Facility microservice-----------------
def addFacility(facilityName):                           # 
    '''Adds a facility to be booked from                 #
    facilityName: name of facility to be added'''        #
                                                         #
def removeFacility(facilityName):                        #
    '''Removes a facility from bookings                  #
    facilityName: name of facility to be removed'''      #
#---------------------------------------------------------

@app.route('/management/staff/<int:staff_id>', methods=['PUT'])
def manageStaff(staffId):
    '''Amends details of chosen staff member
    staffId: id for staff member to be amended
    action: operation to be performed (promote, rename, etc.)'''

    # Parse through the request body
    action = request.args.get('action')
    name = request.args.get('name')

    # Connect to the database
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Perform the requested action
    if action == 'promote':
        c.execute('UPDATE staff SET staffRole = "Manager" WHERE id = ?', (staffId,))
        conn.commit()
        conn.close()
        return {'message': 'Staff member promoted to manager'}, 200

    # Rename the staff member
    elif action == 'rename':
        # In case there is an error:
        if not name:
            return {'message': 'Name is required for rename action'}, 400
        c.execute('UPDATE staff SET staffName = ? WHERE id = ?', (name, staffId))
        conn.commit()
        conn.close()
        return {'message': 'Staff member renamed successfully'}, 200

    # Delete the staff member
    elif action == 'delete':
        c.execute('DELETE FROM staff WHERE id = ?', (staffId,))
        conn.commit()
        conn.close()
        return {'message': 'Staff member deleted successfully'}, 200 

    else:
        return {'message': 'Invalid action'}, 400

@app.route('/health')
def get_health():
    if service_healthy:
        return 200
    else:
        return 'not ok', 500