"""Module to authenticate user"""
import os
import logging
import jwt
import typing
from dotenv import load_dotenv

role = "ADMIN"

load_dotenv()


def authenticate(auth_token):
  """Authenticate user to ensure they can access specific functions"""

  secret_key = typing.cast(str, os.getenv("JWT_SIGNING_SECRET"))

  if not secret_key:
    secret_key = "test"
    logging.warning("No JWT_SECRET_KEY found, using default")

  #HS256 is the algorithm used to encode the token
  token = str.replace(str(auth_token), "Bearer ", "")
  user_token = jwt.decode(token, secret_key, algorithms=["HS256"])

  return user_token["user"]["role"] == role
