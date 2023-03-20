"""Module for checking the health of the microservice"""
import logging
from flask import Flask, Blueprint
from app.models import Facility, OpenTime, Activity
from flask_sqlalchemy import SQLAlchemy


class HealthRouter:
  """Router for the health endpoint"""

  def __init__(self, app: Flask, db: SQLAlchemy) -> None:
    self.logger = logging.getLogger("app.health")
    self.app = app
    self.db = db
    self.blueprint = Blueprint("health", __name__, url_prefix="/health")

    # Add all the routes
    self.setup_routes()

  def setup_routes(self):
    self.blueprint.add_url_rule("/",
                                "get_health",
                                self.get_health,
                                methods=["GET"])

  def get_health(self):
    # Attempt to get an item from the database to check connection
    facility_check = Facility.query.get(1)
    open_time_check = OpenTime.query.get(1)
    activity_check = Activity.query.get(1)

    if not facility_check or not open_time_check or not activity_check:
      return {"status": "degraded"}

    return {"status": "healthy"}, 200
