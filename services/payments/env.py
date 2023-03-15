"""Loads and validates environment variables

If .env is available, loads it into the environment.
"""

import sys
import os
from dotenv import load_dotenv

# Get absolute path of directory where .env is
dirtoenv = os.path.dirname(os.path.abspath(__file__))

# Load .env file from base directory
load_dotenv(os.path.join(dirtoenv, ".env"))

STRIPE_API_KEY = os.getenv("STRIPE_API")
APP_PORT_STRING = os.getenv("APP_PORT")

# Docker defaults unset environment variables to empty strings
# Will need to check if they are not empty strings on top of None

if not STRIPE_API_KEY or STRIPE_API_KEY == "":
    print("Error: 'STRIPE_API' environment variable is not set")
    sys.exit(1)

if not APP_PORT_STRING or APP_PORT_STRING == "":
    print("Error: 'APP_PORT' environment variable is not set")
    sys.exit(1)

try:
    APP_PORT = int(APP_PORT_STRING)
except ValueError:
    print("APP_PORT environment variable is not an integer")
    sys.exit(1)
