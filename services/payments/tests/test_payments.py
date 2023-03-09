import unittest
import sqlite3
import stripe
import requests
import os

import sys
from pathlib import Path
from unittest.mock import Mock, patch

sys.path[0] = str(Path(sys.path[0]).parent)

import payments
from payments import app
from payments import MakePurchasable
from payments import addProductDatabase
from payments import createCheckout
from payments import get_index
from payments import render_template

def create_testDatabase():
    connection = sqlite3.connect("database.db")
    with open('paymentTestSchema.sql') as schema:
      connection.executescript(schema.read())
    connection.close()

class TestingPaymentsMicroservice(unittest.TestCase):
  def setUp(self):
     app.testing = True
     self.client = app.test_client()
     self.product_name = "product-test"
     self.product_price = 50.00
     self.user_id = 467468

  #test createCheckout()
  def test_MakePurchasable_test(self):
    #tests if it can make a test product purchasable
    #payments.MakePurchasable('product-test', 5.0, 'test-type')

    #retrieving the added product from Stripe
    products = stripe.Product.list()
    productStripe = next((p for p in products if p.name == 'product-test'),
                         None)

    price = stripe.Price.list(limit=1, product=productStripe.id).data[0]

    #asserting that the added product matches the expected result
    self.assertEqual(productStripe.name, 'product-test')
    self.assertEqual(price.unit_amount_decimal, '500')

    prices = stripe.Price.list(limit=100, product=productStripe.id).data

    # Delete all prices for the product
    #for price in prices:
    #stripe.Price.delete(price.id)

    # Delete the product
    #stripe.Product.delete(productStripe.id)

  #test addProductDatabase()

  def test_addProductDatabase(self):
    payments.initDatabase()

    #Add products using payments
    payments.addProductDatabase("product-test","price_1MjOpSK4xeIGYs5lrzHsvy8N", 
                                "5", "payment")
    payments.addProductDatabase("subscription-test","price_1MjOq1K4xeIGYs5lvqNSB9l5", 
                                "15", "subscription")
    
    connection = sqlite3.connect('database.db')
    cur = connection.cursor()

    #Fetch products from database
    t1 = cur.execute('''SELECT productName FROM products 
      WHERE priceId LIKE ?''', ['price_1MjOpSK4xeIGYs5lrzHsvy8N']).fetchall()
    t2 = cur.execute('''SELECT productName FROM products
      WHERE priceId LIKE ?''', ['price_1MjOq1K4xeIGYs5lvqNSB9l5']).fetchall()
    connection.close()
    
    #Assert correct products
    self.assertEqual(t1[0][0], "product-test")
    self.assertEqual(t2[0][0], "subscription-test")

  #test createCheckout()
  @patch("stripe.checkout.Session.create")
  def test_create_checkout_success(self, mock_checkout_session_create):
    payments.initDatabase()
    newCustomer = stripe.Customer.create()
    payments.addProductDatabase("product-test","price_1MjOpSK4xeIGYs5lrzHsvy8N", "5", "payment")
    mock_checkout_session_create.return_value = Mock(url='http://localhost:5000/checkout-session')
    session_url = createCheckout(newCustomer.stripe_id, "product-test")
    self.assertEqual(session_url, 'http://localhost:5000/checkout-session')
    stripe.Customer.delete(newCustomer.stripe_id)

  @classmethod
  def setUpClass(self):
    """Create a new app instance and set up a test client"""
    self.app = app.test_client()
    self.app.testing = True

  #test get_index()
  def test_get_index(self):
    """Test if the get_index() function returns a 200 status code"""
    
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "test_index.html"))

    with open(file_path) as file:
      html = file.read()
    response = self.client.get('/')
    self.assertEqual(response.status_code, 200)
    self.assertIn('text/html', response.content_type)
    self.assertEqual(response.data.decode('utf-8'), html)

  #test redirectCheckout()
  def redirectCheckout_test(self):
    a = 1

  #test webhookReceived()
  def webhookReceived_test(self):
    a = 1

  @classmethod
  def tearDownClass(cls):
      """Remove the database file after running all tests"""
      conn = sqlite3.connect('database.db')
      conn.execute("DROP TABLE IF EXISTS orders")
      conn.execute("DROP TABLE IF EXISTS products")
      conn.execute("DROP TABLE IF EXISTS customers")
      conn.commit()
      conn.close()

if __name__ == '__main__':
  unittest.main()
