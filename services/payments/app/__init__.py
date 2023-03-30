"""Creates the flask app
"""

from flask import Flask
from app.database import init_database

app = Flask(__name__, static_url_path="", static_folder="public")

# initialises the database
init_database()
from app import views  #pylint: disable=wrong-import-position
