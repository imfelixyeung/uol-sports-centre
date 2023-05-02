"""Module for accessing the facilities database"""
import logging
from flask import Flask, Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy
from app.models import Facility
from app.create_dictionaries import make_facility
from app.auth import authenticate


class FacilitiesRouter:
  """router to access the /facilities endpoints"""

  def __init__(self, app: Flask, db: SQLAlchemy) -> None:
    self.logger = logging.getLogger("app.facilities")
    self.app = app
    self.db = db
    self.blueprint = Blueprint("facilities", __name__, url_prefix="/facilities")

    # Add all the routes
    self.setup_routes()

  def setup_routes(self):
    self.blueprint.add_url_rule("/",
                                "get_facilities",
                                self.get_facilities,
                                methods=["GET"])

    self.blueprint.add_url_rule("/",
                                "add_facility",
                                self.add_facility,
                                methods=["POST"])

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
    """Get all facilities"""

    # Check to see if page and limit have been supplied
    if request.args.get("page") and request.args.get("limit"):
      try:
        page = int(request.args.get("page"))
        limit = int(request.args.get("limit"))
      except ValueError:
        # Catch value error and return a failed response code before continuing
        return {"status": "Failed", "message": "Invalid input"}, 400

      offset = (page - 1) * limit

      facilities_query = Facility.query.limit(limit).offset(offset).all()

    # If no page and limit supplied return everything
    else:
      facilities_query = Facility.query.all()

    return_array = []

    # Add every facility found in the query to the array as a dictionary
    for facility in facilities_query:
      return_array.append(make_facility(facility))

    # Convert array into flask response
    return_value = make_response(return_array)
    return_value.status_code = 200

    return return_value

  def add_facility(self):
    # Get data from body of post request

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    data = request.json
    name = data.get("name")
    description = data.get("description")
    try:
      capacity = int(data.get("capacity"))
    except ValueError:
      # Catch value error and return a failed response code before continuing
      return {"status": "Failed", "message": "Invalid input"}, 400

    # Add the supplied object to the data base
    new_facility = Facility(name=name,
                            capacity=capacity,
                            description=description)

    # If facility not added for any reason respond failed
    if not new_facility:
      return {"status": "Failed", "message": "Invalid input"}, 400

    self.db.session.add(new_facility)
    self.db.session.commit()

    # Return the status of the addition and the object added to the database
    return_value = make_response({
        "status": "ok",
        "message": "facility added",
        "facility": make_facility(new_facility)
    })
    return_value.status_code = 200

    return return_value

  def get_facility(self, facility_id: int):
    facility_query = Facility.query.get(facility_id)

    # If the facility is not found within the table
    # respond with an error and error code 404
    if not facility_query:
      return {"status": "error", "message": "resource not found"}, 404

    # Else, facility is found so make it into a dictionary
    # then a response with the code 200 for success
    return_value = make_response({
        "status": "ok",
        "facility": make_facility(facility_query)
    })
    return_value.status_code = 200

    return return_value

  def update_facility(self, facility_id: int):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    data = request.json

    # Get item to be updated
    to_update = Facility.query.get(facility_id)

    # Check that the facility has been found
    if not to_update:
      return {"status": "Failed", "message": "Object not found"}, 404

    # Value to check if something has been updated
    update_check = False

    # Check which fields need to be updated
    if "name" in data:
      update_check = True
      to_update.name = data.get("name")

    if "capacity" in data:
      update_check = True
      to_update.capacity = int(data.get("capacity"))

    if "description" in data:
      update_check = True
      to_update.description = data.get("description")

    # If the update check is still false return error as
    # user input is incorrect
    if not update_check:
      return {"status": "Failed", "message": "Invalid input"}, 400

    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "facility updated",
        "facility": make_facility(to_update)
    })

    return_value.status_code = 200
    return return_value

  def delete_facility(self, facility_id: int):

    if not authenticate(request.headers.get("Authorization")):
      return {"status": "Failed", "message": "Permission denied"}, 403

    to_delete = Facility.query.get(facility_id)

    # If the requested
    if not to_delete:
      return {"status": "Failed", "message": "Object not found"}, 404

    # Since to_delete is in the database delete it
    self.db.session.delete(to_delete)
    self.db.session.commit()

    return_value = make_response({
        "status": "ok",
        "message": "facility deleted",
        "facility": make_facility(to_delete)
    })
    return return_value
