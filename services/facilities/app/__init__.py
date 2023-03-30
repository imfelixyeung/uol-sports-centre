"""Initializes the instance of the facilities flask app"""
import logging
from flask import Flask

from app.admin import Admin
from app.api import ActivitiesRouter, FacilitiesRouter, OpenTimesRouter, HealthRouter
from app.database import setup_migration, db


def create_app(testing=False, config=None) -> Flask:
  logging.basicConfig(level=logging.DEBUG)
  # Setup flask
  app = Flask(__name__)
  app.config.from_object("app.config")

  # if is testing, apply custom config
  if testing:
    app.config.update(config)

  # initialise the database with the application
  db.init_app(app)
  setup_migration(app)

  # Add flask admin
  if app.debug is True:
    Admin(app, db)

  # Add routers (blueprints) to the flask applicaiton
  activities_router = ActivitiesRouter(app, db)
  facilities_router = FacilitiesRouter(app, db)
  open_times_router = OpenTimesRouter(app, db)
  health_router = HealthRouter(app, db)

  app.register_blueprint(activities_router.blueprint)
  app.register_blueprint(facilities_router.blueprint)
  app.register_blueprint(open_times_router.blueprint)
  app.register_blueprint(health_router.blueprint)

  # Return the flask application
  return app
