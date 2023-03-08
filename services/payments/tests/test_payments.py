import unittest
import sqlite3
import stripe

import sys
from pathlib import Path

sys.path[0] = str(Path(sys.path[0]).parent)

import payments
from payments import app
from payments import MakePurchasable
from payments import addProductDatabase

def create_testDatabase():
    connection = sqlite3.connect("database.db")
    with open('services/payments/paymentSchema.sql') as schema:
      connection.executescript(schema.read())
    connection.close()

class TestingPaymentsMicroservice(unittest.TestCase):
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
    
    #Add products using payments
    payments.addProductDatabase("product-test","price_1MjOpSK4xeIGYs5lrzHsvy8N", 
                                "5", "payment")
    payments.addProductDatabase("subscription-test","price_1MjOq1K4xeIGYs5lvqNSB9l5", 
                                "15", "subscription")
    
    connection = sqlite3.connect('database.db')
    cur = connection.cursor()

    #Fetch products from database
    t1 = cur.execute('''SELECT productName FROM products 
      WHERE priceId LIKE ?''', ['price_1MifK7K4xeIGYs5lQ5BUqPfD']).fetchall()
    t2 = cur.execute('''SELECT productName FROM products
      WHERE priceId LIKE ?''', ['price_1MjOq1K4xeIGYs5lvqNSB9l5']).fetchall()
    
    #Assert correct products
    self.assertEqual(t1, "product-test")
    self.assertEqual(t2, "subscription-test")

  #test createCheckout()
  def createCheckout_test(self):
    a = 1

  #test get_index()
  def get_index_test(self):
    a = 1

  #test redirectCheckout()
  def redirectCheckout_test(self):
    a = 1

  #test webhookReceived()
  def webhookReceived_test(self):
    a = 1


if __name__ == '__main__':
  unittest.main()
