import os
import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import app, db, models

class dbTests(unittest.TestCase):
    def setUp(self):
        app.config.from_object('config')
        