"""Management Microservice: 
Provides functionality for management-level access 
to the booking system"""
import stripe
from flask import Flask

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

def setDiscount(discountAmount):
    '''Sets specified discount for subscriptions
    discountAmount: discount percentage for membership'''

def setPrice(newPrice, productId):
    '''Sets a price for memberships
    newPrice: price to be set'''

def addActivity(facilityId, newActivity):
    '''Adds a new activity to a chosen facility
    facilityId: Id for facility to be amended
    newActivity: activity to be added to facility'''

def removeActivity(facilityId, activityId):
    '''Removes an activity from a chosen facility
    facilityId: id for facility to be amended
    activityId: activity to be removed'''

#To be coupled with Facility microservice-----------------
def addFacility(facilityName):                           # 
    '''Adds a facility to be booked from                 #
    facilityName: name of facility to be added'''        #
                                                         #
def removeFacility(facilityName):                        #
    '''Removes a facility from bookings                  #
    facilityName: name of facility to be removed'''      #
#---------------------------------------------------------

def manageStaff(staffId, action, name=''):
    '''Amends details of chosen staff member
    staffId: id for staff member to be amended
    action: operation to be performed (promote, rename, etc.)'''

@app.route('/health')
def get_health():
    if service_healthy:
        return 200
    else:
        return 'not ok', 500