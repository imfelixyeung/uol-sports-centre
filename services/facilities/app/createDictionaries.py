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
      "open_time": openTime.opening_time,
      "close_time": openTime.closing_time,
      "facility_id": openTime.facility_id
  }


# Function to generate an Activity dictionary for JSON output
def makeActivity(activity):
  return {
      "id": activity.id,
      "name": activity.name,
      "duration": activity.duration,
      "capacity": activity.capacity,
      "facility_id": activity.facility_id
  }
