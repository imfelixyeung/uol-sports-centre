from flask import Flask

from services.payments.payments import get_index

def test_base_route():
    app = Flask(__name__)
    get_index(app)
    client = app.test_client()
    url = '/'