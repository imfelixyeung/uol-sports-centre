import logging
import json
from flask import Flask, Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy
from app.models import Activity, Facility
from app.createDictionaries import makeActivity


class ActivitiesRouter:

  def __init__(self, app: Flask, db: SQLAlchemy) -> None:
    self.logger = logging.getLogger("app.activities")
    self.app = app
    self.db = db
    self.blueprint = Blueprint("activities", __name__, url_prefix="/activities")

    # setup the routes
    self.setup_routes()

  def setup_routes(self):
    self.blueprint.add_url_rule("/",
                                "get_activities",
                                self.get_activities,
                                methods=["GET"])

    self.blueprint.add_url_rule("/",
                                "add_activity",
                                self.add_activity,
                                methods=["POST"])

    self.blueprint.add_url_rule("/<activity_id>",
                                "get_activity",
                                self.get_activity,
                                methods=["GET"])

    self.blueprint.add_url_rule("/<activity_id>",
                                "update_activity",
                                self.update_activity,
                                methods=["PUT"])

    self.blueprint.add_url_rule("/<activity_id>",
                                "delete_activity",
                                self.delete_activity,
                                methods=["DELETE"])

  def get_activities(self):
    try:
      page = int(request.args.get("page"))
      limit = int(request.args.get("limit"))
    except ValueError:
      # Catch value error and return a failed response code before continuing
      return_value = make_response({
          "status": "Failed",
          "message": "Invalid input"
      })
      return_value.status_code = 400
      return return_value

    offset = (page - 1) * limit

    activities_query = Activity.query.limit(limit).offset(offset).all()

    return_array = []

    # Add every activity found in the query to the array as a dictionary
    for activity in activities_query:
      return_array.append(makeActivity(activity))

    # Turn array into a flask response
    return_value = make_response(return_array)
    return_value.status_code = 200

    return return_value

  def add_activity(self):
    # Get data from body of post request
    data = json.loads(request.data)

    # Check that the supplied foreign key existss
    if not Facility.query.get(int(data.get("facility_id"))):
      # Catch value error and return a failed response code before continuing
      return_value = make_response({
          "status": "Failed",
          "message": "Invalid input"
      })
      return_value.status_code = 400
      return return_value

    # Add the supplied object to the data base
    addition = Activity(name=data.get("name"),
                        duration=data.get("duration"),
                        capacity=data.get("capacity"),
                        facility_id=data.get("facility_id"))

    if not addition:
      return_value = make_response({
          "status": "Failed",
          "message": "Object not added"
      })
      return_value.status_code = 400

    else:
      self.db.session.add(addition)
      self.db.session.commit()

      # Return the status of the addition and the object added to the database
      return_value = make_response({
          "status": "ok",
          "message": "Activity added",
          "facility": makeActivity(addition)
      })
      return_value.status_code = 200

    return return_value

  def get_activity(self, activity_id: int):
    activity_query = Activity.query.get(activity_id)

    # If the activity is not found within the table
    # respond with an error and error code 404
    if not activity_query:
      return_value = make_response({
          "status": "error",
          "message": "resource not found"
      })
      return_value.status_code = 404

    # Else, facility is found so make it into a dictionary
    # then a response with the code 200 for success
    else:
      return_value = make_response(makeActivity(activity_query))
      return_value.status_code = 200

    return return_value

  def update_activity(self, activity_id: int):
    data = json.loads(request.data)

    # Get item to be updated
    to_update = Activity.query.get(activity_id)

    # Check that the facility has been found
    if not to_update:
      return_value = make_response({
          "status": "Failed",
          "message": "Object not found"
      })
      return_value.status_code = 404
      return return_value

    # Value to check if something has been updated
    update_check = False

    # Check which fields need to be updated
    if "name" in data:
      update_check = True
      to_update.name = data.get("name")

    if "capacity" in data:
      update_check = True
      to_update.capacity = int(data.get("capacity"))

    if "duration" in data:
      update_check = True
      to_update.duration = int(data.get("duration"))

    if "facility_id" in data:
      if not Facility.query.get(data.get("facility_id")):
        return_value = make_response({
            "status": "Failed",
            "message": "Object not found"
        })
        return_value.status_code = 404
        return return_value

      else:
        update_check = True
        to_update.facility_id = data.get("facility_id")

    # If the update check is still false return error as
    # user input is incorrect
    if not update_check:
      return_value = make_response({
          "status": "Failed",
          "message": "Incorrect input"
      })
      return_value.status_code = 400
      return return_value

    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "facility updated",
        "facility": makeActivity(to_update)
    })

    return_value.status_code = 200
    return return_value

  def delete_activity(self, activity_id: int):
    return {"status": "error", "message": "Not yet implemented"}
