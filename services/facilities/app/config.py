"""Module to configure new flask app"""
import os

# Set up secret key for testinguse
WTF_CSRF_ENABLED = True

SECRET_KEY = 'facilities_micro'

# Set up for SQLalchemy
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
SQLALCHEMY_TRACK_MODIFICATIONS = True
