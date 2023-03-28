"""Module to authenticate user"""
import os
import jwt


def authenticate(auth_token):
  """Authenticate user to ensure they can access specific functions"""

  secret_key = os.getenv("JWT_SECRET_KEY")

  if not secret_key:
    secret_key = "test"

  #HS256 is the algorithm used to encode the token

  user_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])

  return user_token["user"]["role"] == "admin"
