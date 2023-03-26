'''Unit testing for payments microservice'''
import unittest
import sqlite3
import json
from unittest.mock import patch, MagicMock

import urllib.request
import stripe

from config import DATABASE_SCHEMA_TEST_URL, DATABASE_URL

from app import app
from app.payments import make_a_purchase, get_payment_manager
from app.database import (init_database, add_product, add_customer,
                          get_purchases, delete_product, update_price,
                          delete_customer, get_purchase)
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
    #     app.testing = True
    self.client = app.test_client()
    #     self.product_name = "product-test"
    #     self.product_price = 50.00
    #     self.user_id = 467468

  def test_make_purchasable(self):
    """tests if it can make a test product purchasable"""
    #payments.MakePurchasable('product-test', 5.0, 'test-type')

    #retrieving the added product from Stripe
    products = stripe.Product.list()
    product_stripe = next(
        (p for p in products if p.name == "subscription-test"), None)
    price = stripe.Price.list(limit=1, product=product_stripe.id).data[0]

    #asserting that the added product matches the expected result
    self.assertEqual(product_stripe.name, "subscription-test")
    self.assertEqual(price.unit_amount_decimal, "1500")

  def test_make_a_purchase(self):
    """tests if a purchase can be made correctly"""
    init_database()

    #Add test products to database
    add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")
    add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15",
                "subscription")

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
    products = ["product-test", "subscription-test"]
    response = make_a_purchase(111, products, "subscription")

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
    add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15",
                "subscription")
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

  # @patch("app.database.get_purchase")
  # @patch.object(stripe.Refund, "create")
  # def test_refund(self, mock_refund_create, mock_get_purchase):
  #   """Testing the /refund endpoint"""

  #   # Create an instance of the Flask test client
  #   client = app.test_client()

  #   # Define the test data
  #   test_data = {"order_id": 1, "refund_amount": 5}

  #   # Create a mock purchase object with a valid payment_intent field
  #   mock_purchase = {
  #       "order_id": 1,
  #       "product_id": 1,
  #   }

  #   # Mock the get_purchase() function to return the mock purchase object
  #   mock_get_purchase.return_value = mock_purchase

  #   # Mocking the get_purchase function for a sample purchase
  #   with patch("app.database.get_purchase", mock_get_purchase):

  #     # Make the request to the refund endpoint
  #     response = client.post("/refund",
  #                            data=json.dumps(test_data),
  #                            content_type="application/json")

  #     print("response data: ", response.data)
  #     print("response status code: ", response.status_code)

  #     # Check that the refund was created successfully
  #     mock_refund_create.assert_called_once_with(amount=5,
  #                                                refund_application_fee=True)

  #     # Check that the order was deleted
  #     mock_get_purchase.assert_called_once_with(1)

  #     # Check that the endpoint returned a success status code
  #     assert response.status_code == 200

  #     # Check that the enndpoint returned the expected response body
  #     assert response.json == {"message": "Refund processed successfully."}


if __name__ == "__main__":
  unittest.main()
