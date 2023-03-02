
# Function to generate a facilities dictionary for JSON output
def makeFacility(facility):
    return {
        "id": facility.id,
        "name": facility.name,
        "capacity": facility.capacity
        }

# Function to generate an OpenTimes dictionary for JSON output
def makeOpenTime(openTime):
    return {
        "id": openTime.id,
        "day": openTime.day,
        "openTime": openTime.openingTime,
        "closeTime": openTime.closingTime,
        "facilityID": openTime.facility_id
        }

# Function to generate an Activity dictionary for JSON output
def makeActivity(activity):
    return {
        "id": activity.id,
        "duration": activity.duration,
        "capacity": activity.capacity,
        "facilityID": activity.facility_id
        }