import logging
import json
from flask import Flask, Blueprint, request
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
      return json.dumps({
          "status": "Failed",
          "message": "Incorrect argument type"
      })

    offset = (page - 1) * limit

    open_time_query = OpenTime.query.limit(limit).offset(offset).all()

    return_array = []

    for open_time in open_time_query:
      return_array.append(makeOpenTime(open_time))

    return json.dumps(return_array)

  def add_open_time(self):
    # Get data from body of post request
    data = json.loads(request.data)

    # Check that the supplied foreign key existss
    if (not Facility.query.get(int(data.get("facilityID")))):
      return json.dumps({"status": "failed", "message": "facility not found"})

    # Add the supplied object to the data base
    addition = OpenTime(day=data.get("day"),
                        openingTime=data.get("openTime"),
                        closingTime=data.get("closeTime"),
                        facility_id=data.get("facilityID"))
    self.db.session.add(addition)
    self.db.session.commit()

    # Return the status of the addition and the object added to the database
    return_value = {
        "status": "ok",
        "message": "Opening time added",
        "facility": makeOpenTime(addition)
    }

    return json.dumps(return_value)

  def get_open_time(self, time_id: int):
    open_time_query = OpenTime.query.get(time_id)

    return_value = makeOpenTime(open_time_query)

    return json.dumps(return_value)

  def update_open_time(self, time_id: int):
    return {"status": "error", "message": "Not yet implemented"}

  def delete_open_time(self, time_id: int):
    return {"status": "error", "message": "Not yet implemented"}
