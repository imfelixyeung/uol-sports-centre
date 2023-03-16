import logging
from flask import Flask, Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy


class HealthRouter:

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
    return {"status": "ok"}