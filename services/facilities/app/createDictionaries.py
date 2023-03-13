# Function to generate a facilities dictionary for JSON output
def make_facility(facility):
  return {
      "id": facility.id,
      "name": facility.name,
      "capacity": facility.capacity
  }


# Function to generate an OpenTimes dictionary for JSON output
def make_open_time(openTime):
  return {
      "id": openTime.id,
      "day": openTime.day,
      "opening_time": openTime.opening_time,
      "closing_time": openTime.closing_time,
      "facility_id": openTime.facility_id
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
