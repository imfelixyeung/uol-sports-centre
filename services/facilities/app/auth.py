import os
import jwt


def authenticate():
  """Authenticate user to ensure they can access specific functions"""

  secret_key = os.getenv("JWT_SECRET_KEY")

  print("-----------------------------------------------------")
  print(secret_key)
  #HS256 is the algorithm used to encode the token


#   user_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])

#   print(user_token)
