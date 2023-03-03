import logging
import json
from flask import Flask, Blueprint, request
from flask_sqlalchemy import SQLAlchemy
from app.models import Facility
from app.createDictionaries import makeFacility


class FacilitiesRouter:

    def __init__(self, app: Flask, db: SQLAlchemy) -> None:
        self.logger = logging.getLogger("app.facilities")
        self.app = app
        self.db = db
        self.blueprint = Blueprint("facilities",
                                   __name__,
                                   url_prefix="/facilities")

        # Add all the routes
        self.setup_routes()

    def setup_routes(self):
        self.blueprint.add_url_rule("/",
                                    "get_facilities",
                                    self.get_facilities,
                                    methods=['GET'])

        self.blueprint.add_url_rule("/",
                                    "add_facility",
                                    self.add_facility,
                                    methods=['POST'])

        self.blueprint.add_url_rule("/<facility_id>",
                                    "get_facility",
                                    self.get_facility,
                                    methods=["GET"])

        self.blueprint.add_url_rule("/<facility_id>",
                                    "update_facility",
                                    self.update_facility,
                                    methods=["PUT"])

        self.blueprint.add_url_rule("/<facility_id>",
                                    "delete_facility",
                                    self.delete_facility,
                                    methods=["DELETE"])

    def get_facilities(self):
        return {
            "status": "error",
            "message": "Not yet implemented",
            "notes": "Hell Yeah!"
        }

    def add_facility(self):
        # Get data from body of post request
        data = json.loads(request.data)
        name = data.get("name")
        try:
            capacity = int(data.get("capacity"))
        except:
            return json.dumps({"status": "Failed", "message": "Object not added"})

        # Add the supplied object to the data base
        new_facility = Facility(name=name, capacity=capacity)

        if(not new_facility):
            return json.dumps({"status": "Failed", "message": "Object not added"})

        self.db.session.add(new_facility)
        self.db.session.commit()

        # Return the status of the addition and the object added to the database
        returnValue = {
            "status": "ok",
            "message": "facility added",
            "facility": makeFacility(new_facility)
        }

        return json.dumps(returnValue)

    def get_facility(self, facility_id: int):
        facility_query = Facility.query.get(facility_id)

        if (not facility_query):
            returnValue = {"status": "error", "message": "resource not found"}
        else:
            returnValue = makeFacility(facility_query)

        return json.dumps(returnValue)

    def update_facility(self, facility_id: int):
        return {"status": "error", "message": "Not yet implemented"}

    def delete_facility(self, facility_id: int):
        return {"status": "error", "message": "Not yet implemented"}
