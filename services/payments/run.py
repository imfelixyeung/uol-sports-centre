"""Entry point for the service
"""

from app import app
from env import APP_PORT, DEBUG

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=APP_PORT, debug=DEBUG)
