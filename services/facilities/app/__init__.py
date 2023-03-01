from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_admin import Admin

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

admin = Admin(app, template_mode='bootstrap4')

migrate = Migrate(app, db)

import logging
logging.basicConfig(level=logging.DEBUG)

from app import facilities, models