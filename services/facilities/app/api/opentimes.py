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
    return {
        "status": "error",
        "message": "Not yet implemented",
        "notes": "Hell Yeah!"
    }

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
    returnValue = {
        "status": "ok",
        "message": "Opening time added",
        "facility": makeOpenTime(addition)
    }

    return json.dumps(returnValue)

  def get_open_time(self, time_id: int):
    openTimeQuery = OpenTime.query.get(time_id)

    returnValue = makeOpenTime(openTimeQuery)

    return json.dumps(returnValue)

  def update_open_time(self, time_id: int):
    return {"status": "error", "message": "Not yet implemented"}

  def delete_open_time(self, time_id: int):
    return {"status": "error", "message": "Not yet implemented"}
