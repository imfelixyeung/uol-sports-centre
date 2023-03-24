"""Module to convert a database object to a python dictionary"""


# Function to generate a facilities dictionary for JSON output
def make_facility(facility):
  return {
      "id": facility.id,
      "name": facility.name,
      "capacity": facility.capacity,
      "description": facility.description
  }


# Function to generate an OpenTimes dictionary for JSON output
def make_open_time(open_time):
  return {
      "id": open_time.id,
      "day": open_time.day,
      "opening_time": open_time.opening_time,
      "closing_time": open_time.closing_time,
      "facility_id": open_time.facility_id
  }


# Function to generate an Activity dictionary for JSON output
def make_activity(activity):
  return {
      "id": activity.id,
      "name": activity.name,
      "duration": activity.duration,
      "capacity": activity.capacity,
      "facility_id": activity.facility_id
  }
