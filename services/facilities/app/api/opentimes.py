import logging
import json
from flask import Flask, Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy
from app.models import OpenTime, Facility
from app.createDictionaries import makeOpenTime


class OpenTimesRouter:

  def __init__(self, app: Flask, db: SQLAlchemy) -> None:
    self.logger = logging.getLogger("app.opentimes")
    self.app = app
    self.db = db
    self.blueprint = Blueprint("opentimes", __name__, url_prefix="/times")

    # Add all the routes
    self.setup_routes()

  def setup_routes(self):
    self.blueprint.add_url_rule("/",
                                "get_open_times",
                                self.get_open_times,
                                methods=["GET"])

    self.blueprint.add_url_rule("/",
                                "add_open_time",
                                self.add_open_time,
                                methods=["POST"])

    self.blueprint.add_url_rule("/<time_id>",
                                "get_open_time",
                                self.get_open_time,
                                methods=["GET"])

    self.blueprint.add_url_rule("/<time_id>",
                                "update_open_time",
                                self.update_open_time,
                                methods=["PUT"])

    self.blueprint.add_url_rule("/<time_id>",
                                "delete_open_time",
                                self.delete_open_time,
                                methods=["DELETE"])

  def get_open_times(self):

    # Check to see if page and limit have been supplied
    if request.args.get("page") and request.args.get("limit"):
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

      open_time_query = OpenTime.query.limit(limit).offset(offset).all()

    # If no page and limit supplied return everything
    else:
      open_time_query = OpenTime.query.all()

    return_array = []

    for open_time in open_time_query:
      return_array.append(makeOpenTime(open_time))

    # Turn array into a flask response
    return_value = make_response(return_array)
    return_value.status_code = 200

    return return_value

  def add_open_time(self):
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
    addition = OpenTime(day=data.get("day"),
                        opening_time=data.get("opening_time"),
                        closing_time=data.get("closing_time"),
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
          "message": "Opening time added",
          "open_time": makeOpenTime(addition)
      })
      return_value.status_code = 200

    return return_value

  def get_open_time(self, time_id: int):
    open_time_query = OpenTime.query.get(time_id)

    # If the activity is not found within the table
    # respond with an error and error code 404
    if not open_time_query:
      return_value = make_response({
          "status": "error",
          "message": "resource not found"
      })
      return_value.status_code = 404

    # Else, facility is found so make it into a dictionary
    # then a response with the code 200 for success
    else:
      return_value = make_response(makeOpenTime(open_time_query))
      return_value.status_code = 200

    return return_value

  def update_open_time(self, time_id: int):
    data = json.loads(request.data)

    # Get item to be updated
    to_update = OpenTime.query.get(time_id)

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
    if "day" in data:
      update_check = True
      to_update.day = data.get("day")

    if "opening_time" in data:
      update_check = True
      to_update.opening_time = int(data.get("opening_time"))

    if "closing_time" in data:
      update_check = True
      to_update.closing_time = int(data.get("closing_time"))

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
        "message": "opening time updated",
        "open_time": makeOpenTime(OpenTime.query.get(time_id))
    })

    return_value.status_code = 200
    return return_value

  def delete_open_time(self, time_id: int):
    to_delete = OpenTime.query.get(time_id)

    # If the requested
    if not to_delete:
      return_value = make_response({
          "status": "Failed",
          "message": "Object not found"
      })
      return_value.status_code = 404
      return return_value

    # Since to_delete is in the database delete it
    self.db.session.delete(to_delete)
    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "opening time deleted",
        "open_time": makeOpenTime(to_delete)
    })
    return return_value
