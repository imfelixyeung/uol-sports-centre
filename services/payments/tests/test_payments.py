"""Unit testing for payments microservice"""
import unittest
import sqlite3
import json
from unittest import mock
from unittest.mock import patch

import urllib.request
import stripe

from config import DATABASE_SCHEMA_TEST_URL, DATABASE_URL

from app import app
from app.payments import make_a_purchase, get_payment_manager
from app.database import (init_database, add_product, add_customer,
                          delete_product, update_price, delete_customer)
from app.interfaces import create_checkout


def create_test_database():
  """Createst the database for the tests"""
  connection = sqlite3.connect(DATABASE_URL)
  with open(DATABASE_SCHEMA_TEST_URL, encoding="utf-8") as schema:
    connection.executescript(schema.read())
  connection.close()


class TestingPaymentsMicroservice(unittest.TestCase):
  """Testing the payments microservice"""

  def setUp(self):
    self.client = app.test_client()

  def test_make_purchasable(self):
    """tests if it can make a test product purchasable"""
    with app.test_client() as client:

      data = {
          "product_name": "Subscription-test",
          "product_price": 15.0,
          "product_type": "membership"
      }

      response = client.post("/make-purchasable", json=data)

      # Assert the response code
      self.assertEqual(response.status_code, 200)

  def test_make_a_purchase(self):
    """tests if a purchase can be made correctly"""
    init_database()

    #Add test products to database
    add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")
    add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15", "membership")

    #Make a new temp customer on Stripe
    new_customer = stripe.Customer.create()

    #Add customer to database
    add_customer(111, new_customer.stripe_id)

    # Add test card to the customer
    card_token = stripe.Token.create(card={
        "number": "4242424242424242",
        "exp_month": 12,
        "exp_year": 2024,
        "cvc": "123",
    },)

    card = stripe.Customer.create_source(new_customer.id, source=card_token)

    # Link the card to the customer
    stripe.Customer.modify(new_customer.id, default_source=card.id)

    #Make a purchase with multiple products
    products = [{
        "type": "product-test",
        "data": {}
    }, {
        "type": "subscription-test",
        "data": {}
    }]
    response = make_a_purchase(111, products, "subscription", 6)

    # Check if session URL is returned
    self.assertIsNotNone(response)

    #Delete temp customer
    stripe.Customer.delete(new_customer.stripe_id)
    delete_customer(111, new_customer.stripe_id)

    delete_product("prod_NUNazbUQcwZQaU")
    delete_product("prod_NUNbPMJPMIEvWk")

  def test_add_product(self):
    """Testing the functionality of adding products"""
    init_database()

    #Add test products to the database
    add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")
    add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15", "membership")
    connection = sqlite3.connect(DATABASE_URL)
    cur = connection.cursor()

    #Fetch products from database
    test_1 = cur.execute(
        """SELECT productName FROM products
      WHERE product_id LIKE ?""", ["prod_NUNazbUQcwZQaU"]).fetchall()
    test_2 = cur.execute(
        """SELECT productName FROM products
      WHERE product_id LIKE ?""", ["prod_NUNbPMJPMIEvWk"]).fetchall()
    connection.close()

    #Assert correct products
    self.assertEqual(test_1[0][0], "product-test")
    self.assertEqual(test_2[0][0], "subscription-test")

    delete_product("prod_NUNazbUQcwZQaU")
    delete_product("prod_NUNbPMJPMIEvWk")

  def test_change_price(self):
    """Tests the change price functionality"""
    #initialise database
    init_database()

    #Add test products to the databse
    add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")

    #Update price of product
    update_price("product-test", "10")

    connection = sqlite3.connect(DATABASE_URL)
    cur = connection.cursor()

    #Fetch product price from database
    test_1 = cur.execute(
        '''SELECT product_id, price FROM products
    WHERE productName LIKE ?''', ["product-test"]).fetchone()
    connection.close()

    #Assert correct price
    self.assertEqual(test_1[1], "10")

    # Delete added product
    delete_product("prod_NUNazbUQcwZQaU")

  def test_get_prices(self):
    """Test that gets the pricing list"""

    add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")

    with app.test_client() as client:
      response = client.get("/get-prices/session")

      assert response.status_code == 200
      assert response.content_type == "application/json"

      data = json.loads(response.data)
      assert isinstance(data, list)

      assert len(data) == 1
      assert data[0]["productName"] == "product-test"
      assert data[0]["price"] == "5"

  def test_create_checkout_success(self):
    """Tests the create checkout functionality for the success case"""
    #initialise Database
    init_database()

    #Create temp new customer on stripe
    new_customer = stripe.Customer.create()

    #Add test product to payments service
    add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")

    #Assert valid checkout URL response
    session_url = create_checkout(new_customer.stripe_id, "product-test")

    # Check if sesion_url is None
    if session_url is None:
      self.fail("Invalid checkout URL provided.")

    with urllib.request.urlopen(session_url) as response:
      self.assertEqual(response.getcode(), 200)

    #Delete temp customer
    stripe.Customer.delete(new_customer.stripe_id)

  def test_customer_portal(self):
    """Tests the customer portal functionality"""
    #initialise Database
    init_database()

    #Create temp new customer on stripe
    new_customer = stripe.Customer.create()

    #Add customer to database with '111' as ID
    add_customer(111, new_customer.stripe_id)

    #Assert valid portal URL response
    session_url = get_payment_manager(111)
    with urllib.request.urlopen(session_url) as response:
      self.assertEqual(response.getcode(), 200)

    #Delete temp customer
    stripe.Customer.delete(new_customer.stripe_id)

  @mock.patch("jwt.decode")
  def test_purchased_products(self, mock_jwt):
    """Function that checks the functionality of purchased_products end point"""

    # Mock the jwt.decode function to return a mocked decoded token
    mock_jwt.return_value = {"user": {"role": "USER"}}

    # Line inspired by stack-overflaw #
    response = self.client.get("/purchased-products/1",
                               headers={"Authorization": "Bearer <JWT_TOKEN>"})

    # Check that the response status code is 200
    self.assertEqual(response.status_code, 200)

    # Check that the response is a list of purchased products
    purchased_products = json.loads(response.data)
    self.assertIsInstance(purchased_products, list)

  @mock.patch("jwt.decode")
  def test_get_sales(self, mock_jwt):
    """Function that checks the functionality of get_sales_lastweek end point"""

    # Mock the jwt.decode function to return a mocked decoded token
    mock_jwt.return_value = {"user": {"role": "MANAGER"}}

    # Line inspired by stack-overflaw #
    response = self.client.get("/sales/membership",
                               headers={"Authorization": "Bearer <JWT_TOKEN>"})

    # Check that the response status code is 200
    self.assertEqual(response.status_code, 200)

    # Get the data
    data = json.loads(response.data)

    # Check that the received data is a list
    self.assertIsInstance(data, list)

  # @patch("stripe.Refund.create")
  # def test_refund(self, mock_stripe):
  #   """ Function to test functionality of refund endpoint"""

  #   # Test data:
  #   test_booking_id = 1234

  #   with patch("app.database.get_order") as mock_get_order:
  #     mock_get_order.return_value = [
  #         1234, 1, "prod_1234", "2020-12-31", "ch_1234", 1234
  #     ]

  #   mock_stripe.return_value = {"status": 200}

  #   # Call the endpoint
  #   response = self.client.get(f"/refund/{test_booking_id}")

  #   # Check the response
  #   self.assertEqual(response.status_code, 200)
  #   self.assertEqual(response.json,
  #                    {"message": "Refund processed successfully."})


if __name__ == "__main__":
  unittest.main()
