"""Module to set up flask admin for Debugging purposes"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin as FlaskAdmin
from flask_admin.contrib.sqla import ModelView

from app.models import Activity, Facility, OpenTime


class Admin:
  """Admin class to set up flask admin"""

  def __init__(self, app: Flask, db: SQLAlchemy):
    # save references to app and db
    self.app = app
    self.db = db

    # Setup flask admin
    self.admin = FlaskAdmin(app, template_mode='bootstrap4')
    self.add_models()

  def add_models(self):
    self.admin.add_view(ModelView(Facility, self.db.session))
    self.admin.add_view(ModelView(OpenTime, self.db.session))
    self.admin.add_view(ModelView(Activity, self.db.session))
