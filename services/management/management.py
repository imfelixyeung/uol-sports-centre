"""Management Microservice:
Provides functionality for management-level access
to the booking system"""
import sqlite3
from flask import Flask, request

app = Flask(__name__, static_url_path='', static_folder='public')


def init_database():
    '''Initialise database from schema'''
    connection = sqlite3.connect('database.db')
    with open('services/management/managementSchema.sql',
              encoding="utf-8") as schema:
        connection.executescript(schema.read())
    connection.close()


"""
#To be coupled with Facility microservice-----------------
def addFacility(facilityName):                           # 
    '''Adds a facility to be booked from                 #
    facilityName: name of facility to be added'''        #
                                                         #
def removeFacility(facilityName):                        #
    '''Removes a facility from bookings                  #
    facilityName: name of facility to be removed'''      #
#---------------------------------------------------------

#To be coupled with Payments microservice-----------------
def set_discount(discount_amount):                       #
    '''Sets specified discount for subscriptions         #
    discountAmount: discount percentage for membership'''#
                                                         #
def setPrice(newPrice, productName):                     #
    '''Sets a price for memberships                      #
    newPrice: price to be set'''                         #
#---------------------------------------------------------
"""


@app.route('/management/staff/<int:staff_id>', methods=['PUT'])
def manage_staff(staff_id):
    '''Amends details of chosen staff member
    staffId: id for staff member to be amended
    action: operation to be performed (promote, rename, etc.)'''

    # Parse through the request body
    action = request.args.get('action')
    name = request.args.get('name')

    # Connect to the database
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Perform the requested action
    if action == 'promote':
        cursor.execute('UPDATE staff SET staffRole = "Manager" WHERE id = ?',
                       (staff_id,))
        conn.commit()
        conn.close()
        return {'message': 'Staff member promoted to manager'}, 200

    # Rename the staff member
    elif action == 'rename':
        # In case there is an error:
        if not name:
            return {'message': 'Name is required for rename action'}, 400
        cursor.execute('UPDATE staff SET staffName = ? WHERE id = ?',
                       (name, staff_id))
        conn.commit()
        conn.close()
        return {'message': 'Staff member renamed successfully'}, 200

    # Delete the staff member
    elif action == 'delete':
        cursor.execute('DELETE FROM staff WHERE id = ?', (staff_id,))
        conn.commit()
        conn.close()
        return {'message': 'Staff member deleted successfully'}, 200

    else:
        return {'message': 'Invalid action'}, 400


@app.route('/health')
def get_health():
    """Gets the health of the management microservice"""
    if service_healthy:
        return 200
    else:
        return 'not ok', 500
