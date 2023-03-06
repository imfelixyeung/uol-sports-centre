import logging
import json
from flask import Flask, Blueprint, request
from flask_sqlalchemy import SQLAlchemy
from app.models import Activity, Facility
from app.createDictionaries import makeActivity


class ActivitiesRouter:

  def __init__(self, app: Flask, db: SQLAlchemy) -> None:
    self.logger = logging.getLogger("app.activities")
    self.app = app
    self.db = db
    self.blueprint = Blueprint("activities",
                               __name__,
                               url_prefix="/activities")

    # setup the routes
    self.setup_routes()

  def setup_routes(self):
    self.blueprint.add_url_rule("/",
                                "get_activities",
                                self.get_activities,
                                methods=['GET'])

    self.blueprint.add_url_rule("/",
                                "add_activity",
                                self.add_activity,
                                methods=['POST'])

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
    return {"status": "error", "message": "Not yet implemented"}

  def add_activity(self):
    # Get data from body of post request
    data = json.loads(request.data)

    # Check that the supplied foreign key existss
    if (not Facility.query.get(int(data.get("facilityID")))):
      return json.dumps({"status": "failed", "message": "facility not found"})

    # Add the supplied object to the data base
    addition = Activity(duration=data.get("duration"),
                        capacity=data.get("capacity"),
                        facility_id=data.get("facilityID"))
    self.db.session.add(addition)
    self.db.session.commit()

    if (not addition):
      return json.dumps({"status": "failed", "message": "activity not added"})

    # Return the status of the addition and the object added to the database
    returnValue = {
        "status": "ok",
        "message": "Opening time added",
        "facility": makeActivity(addition)
    }

    return json.dumps(returnValue)

  def get_activity(self, activity_id: int):
    activityQuery = Activity.query.get(activity_id)

    returnValue = makeActivity(activityQuery)

    return json.dumps(returnValue)

  def update_activity(self, activity_id: int):
    return {"status": "error", "message": "Not yet implemented"}

  def delete_activity(self, activity_id: int):
    return {"status": "error", "message": "Not yet implemented"}
