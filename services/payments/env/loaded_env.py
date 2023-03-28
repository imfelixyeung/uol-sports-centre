"""Loads and validates environment variables

If .env is available, loads it into the environment.
"""

import sys
import os
import typing
from dotenv import load_dotenv

# Load .env file
load_dotenv()

STRIPE_API_KEY = typing.cast(str, os.getenv("STRIPE_API"))
APP_PORT_STRING = typing.cast(str, os.getenv("APP_PORT"))
STRIPE_WEBHOOK_KEY = typing.cast(str, os.getenv("STRIPE_WEBHOOK"))
JWT_SIGNING_SECRET = typing.cast(str, os.getenv("JWT_SIGNING_SECRET"))
DEBUG = os.getenv("DEBUG") in ["True", "true"]

# Docker defaults unset environment variables to empty strings
# Will need to check if they are not empty strings on top of None

if not STRIPE_API_KEY:
  print("Error: 'STRIPE_API' environment variable is not set")
  sys.exit(1)

if not APP_PORT_STRING:
  print("Error: 'APP_PORT' environment variable is not set")
  sys.exit(1)

if not STRIPE_WEBHOOK_KEY:
  print("Error: 'STRIPE_WEBHOOK' environment variable is not set")
  sys.exit(1)

if not JWT_SIGNING_SECRET:
  print("Error: 'JWT_SIGNING_SECRET' environment variable is not set")
  sys.exit(1)

try:
  APP_PORT = int(APP_PORT_STRING)
except ValueError:
  print("APP_PORT environment variable is not an integer")
  sys.exit(1)
