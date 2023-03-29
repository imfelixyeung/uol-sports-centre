"""Module for accessing the activities database"""
import logging
from flask import Flask, Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy
from app.models import Activity, Facility
from app.create_dictionaries import make_activity
from app.auth import authenticate


class ActivitiesRouter:
  """router to access the /activities endpoints"""

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

    # Check to see if page and limit have been supplied
    if request.args.get("page") and request.args.get("limit"):
      try:
        page = int(request.args.get("page"))
        limit = int(request.args.get("limit"))
      except ValueError:
        # Catch value error and return a failed response code before continuing
        return {"status": "Failed", "message": "Invalid input"}, 400

      offset = (page - 1) * limit

      activities_query = Activity.query.limit(limit).offset(offset).all()

    # If no page and limit supplied return everything
    else:
      activities_query = Activity.query.all()

    return_array = []

    # Add every activity found in the query to the array as a dictionary
    for activity in activities_query:
      return_array.append(make_activity(activity))

    # Turn array into a flask response
    return_value = make_response(return_array)
    return_value.status_code = 200

    return return_value

  def add_activity(self):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    # Get data from body of post request
    data = request.json

    # Make sure we have correct data types for integer values
    try:
      capacity = int(data.get("capacity"))
      duration = int(data.get("duration"))
    except ValueError:
      # Catch value error and return a failed response code before continuing
      return {"status": "Failed", "message": "Invalid input"}, 400

    # Check that the supplied foreign key existss
    if not Facility.query.get(int(data.get("facility_id"))):
      # Catch value error and return a failed response code before continuing
      return {"status": "Failed", "message": "Invalid input"}, 400

    # Add the supplied object to the data base
    addition = Activity(name=data.get("name"),
                        duration=duration,
                        capacity=capacity,
                        facility_id=data.get("facility_id"))

    if not addition:
      return {"status": "Failed", "message": "Invalid input"}, 400

    self.db.session.add(addition)
    self.db.session.commit()

    # Return the status of the addition and the object added to the database
    return_value = make_response({
        "status": "ok",
        "message": "Activity added",
        "activity": make_activity(addition)
    })
    return_value.status_code = 200

    return return_value

  def get_activity(self, activity_id: int):
    activity_query = Activity.query.get(activity_id)

    # If the activity is not found within the table
    # respond with an error and error code 404
    if not activity_query:
      return {"status": "error", "message": "resource not found"}, 404

    # Else, facility is found so make it into a dictionary
    # then a response with the code 200 for success
    return_value = make_response(make_activity(activity_query))
    return_value.status_code = 200

    return return_value

  def update_activity(self, activity_id: int):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    data = request.json

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
        return {"status": "Failed", "message": "Object not found"}, 404

      update_check = True
      to_update.facility_id = data.get("facility_id")

    # If the update check is still false return error as
    # user input is incorrect
    if not update_check:
      return {"status": "Failed", "message": "Invalid input"}, 400

    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "activity updated",
        "activity": make_activity(to_update)
    })

    return_value.status_code = 200
    return return_value

  def delete_activity(self, activity_id: int):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    to_delete = Activity.query.get(activity_id)

    # If the requested
    if not to_delete:
      return {"status": "Failed", "message": "Object not found"}, 404

    # Since to_delete is in the database delete it
    self.db.session.delete(to_delete)
    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "activity deleted",
        "activity": make_activity(to_delete)
    })
    return return_value
