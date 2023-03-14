""" 
FACILITIES TESTS
"""


def test_get_facility(client) -> None:
  response = client.get("/facilities/1")
  expected_response = {
      "status": "ok",
      "facility": {
          "id": 1,
          "name": "Football",
          "capacity": 20
      }
  }

  response_data = response.json

  assert response_data == expected_response
