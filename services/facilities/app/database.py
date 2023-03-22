"""Module to initialize Flask Database"""
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def setup_migration(app: Flask):
  Migrate(app, db)
