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
    self.blueprint = Blueprint("activities", __name__, url_prefix="/activities")

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
    try:
      page = int(request.args.get("page"))
      limit = int(request.args.get("limit"))
    except ValueError:
      return json.dumps({
          "status": "Failed",
          "message": "Incorrect argument type"
      })

    offset = (page - 1) * limit

    activities_query = Activity.query.limit(limit).offset(offset).all()

    return_array = []

    for activity in activities_query:
      return_array.append(makeActivity(activity))

    return json.dumps(return_array)

  def add_activity(self):
    # Get data from body of post request
    data = json.loads(request.data)

    # Check that the supplied foreign key existss
    if (not Facility.query.get(int(data.get("facility_id")))):
      return json.dumps({"status": "failed", "message": "facility not found"})

    # Add the supplied object to the data base
    addition = Activity(name=data.get("name"),
                        duration=data.get("duration"),
                        capacity=data.get("capacity"),
                        facility_id=data.get("facility_id"))
    self.db.session.add(addition)
    self.db.session.commit()

    if (not addition):
      return json.dumps({"status": "failed", "message": "activity not added"})

    # Return the status of the addition and the object added to the database
    return_value = {
        "status": "ok",
        "message": "Opening time added",
        "facility": makeActivity(addition)
    }

    return json.dumps(return_value)

  def get_activity(self, activity_id: int):
    activity_query = Activity.query.get(activity_id)

    return_value = makeActivity(activity_query)

    return json.dumps(return_value)

  def update_activity(self, activity_id: int):
    return {"status": "error", "message": "Not yet implemented"}

  def delete_activity(self, activity_id: int):
    return {"status": "error", "message": "Not yet implemented"}