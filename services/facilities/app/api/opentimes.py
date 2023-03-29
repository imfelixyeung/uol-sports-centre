"""Module fo accessing the open_times table"""
import logging
from flask import Flask, Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy
from app.models import OpenTime, Facility
from app.create_dictionaries import make_open_time
from app.auth import authenticate


class OpenTimesRouter:
  """Router for accessing the /times endpoints"""

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
        return {"status": "Failed", "message": "Invalid input"}, 400

      offset = (page - 1) * limit

      open_time_query = OpenTime.query.limit(limit).offset(offset).all()

    # If no page and limit supplied return everything
    else:
      open_time_query = OpenTime.query.all()

    return_array = []

    for open_time in open_time_query:
      return_array.append(make_open_time(open_time))

    # Turn array into a flask response
    return_value = make_response(return_array)
    return_value.status_code = 200

    return return_value

  def add_open_time(self):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    # Get data from body of post request
    data = request.json

    try:
      opening_time = int(data.get("opening_time"))
      closing_time = int(data.get("closing_time"))
    except ValueError:
      # Catch value error and return a failed response code before continuing
      return {"status": "Failed", "message": "Invalid input"}, 400

    # Check that the supplied foreign key existss
    if not Facility.query.get(int(data.get("facility_id"))):
      # Catch value error and return a failed response code before continuing
      return {"status": "Failed", "message": "Invalid input"}, 400

    # Add the supplied object to the data base
    addition = OpenTime(day=data.get("day"),
                        opening_time=opening_time,
                        closing_time=closing_time,
                        facility_id=data.get("facility_id"))
    if not addition:
      return {"status": "Failed", "message": "Invalid input"}, 400
    self.db.session.add(addition)
    self.db.session.commit()

    # Return the status of the addition and the object added to the database
    return_value = make_response({
        "status": "ok",
        "message": "Opening time added",
        "open_time": make_open_time(addition)
    })
    return_value.status_code = 200

    return return_value

  def get_open_time(self, time_id: int):
    open_time_query = OpenTime.query.get(time_id)

    # If the activity is not found within the table
    # respond with an error and error code 404
    if not open_time_query:
      return {"status": "error", "message": "resource not found"}, 404

    # Else, facility is found so make it into a dictionary
    # then a response with the code 200 for success
    return_value = make_response(make_open_time(open_time_query))
    return_value.status_code = 200

    return return_value

  def update_open_time(self, time_id: int):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    data = request.json

    # Get item to be updated
    to_update = OpenTime.query.get(time_id)

    # Check that the facility has been found
    if not to_update:
      return {"status": "Failed", "message": "Object not found"}, 404

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
        "message": "opening time updated",
        "open_time": make_open_time(OpenTime.query.get(time_id))
    })

    return_value.status_code = 200
    return return_value

  def delete_open_time(self, time_id: int):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    to_delete = OpenTime.query.get(time_id)

    # If the requested
    if not to_delete:
      return {"status": "Failed", "message": "Object not found"}, 404

    # Since to_delete is in the database delete it
    self.db.session.delete(to_delete)
    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "opening time deleted",
        "open_time": make_open_time(to_delete)
    })
    return return_value
