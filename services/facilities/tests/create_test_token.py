"""Module to generate a test token"""
import jwt


def create_test_token(role="ADMIN"):
  """Create a test token for testing purposes"""

  payload = {"user": {"id": 1, "email": "Test@test.com", "role": role}}

  return jwt.encode(payload, "test", algorithm="HS256")
