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
                                methods=['GET'])

    self.blueprint.add_url_rule("/",
                                "add_open_time",
                                self.add_open_time,
                                methods=['POST'])

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
    if (not Facility.query.get(int(data.get("facility_id")))):
      # Catch value error and return a failed response code before continuing
      return_value = make_response({
          "status": "Failed",
          "message": "Invalid input"
      })
      return_value.status_code = 400
      return return_value

    # Add the supplied object to the data base
    addition = OpenTime(day=data.get("day"),
                        opening_time=data.get("open_time"),
                        closing_time=data.get("close_time"),
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
          "facility": makeOpenTime(addition)
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
    return {"status": "error", "message": "Not yet implemented"}

  def delete_open_time(self, time_id: int):
    return {"status": "error", "message": "Not yet implemented"}
