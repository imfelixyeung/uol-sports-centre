"""Loads and validates environment variables

If .env is available, loads it into the environment.
"""

import os
from dotenv import load_dotenv

# Get absolute path of directory where .env is
dirtoenv = os.path.dirname(os.path.abspath(__file__))

# Load .env file from base directory
load_dotenv(os.path.join(dirtoenv, ".env"))

STRIPE_API_KEY = os.getenv("STRIPE_API")
APP_PORT = os.getenv("APP_PORT")
