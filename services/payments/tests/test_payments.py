'''Unit testing for payments microservice'''
import unittest
import sqlite3
import stripe
import os
import urllib.request

import sys
from pathlib import Path

from server import app
from payments import *
from database import init_database
from database import add_product

sys.path[0] = str(Path(sys.path[0]).parent)


def create_test_database():
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

    #test addProduct()
    def test_add_product(self):
        init_database()

        #Add test products to the databse
        add_product("product-test", "price_1MjOpSK4xeIGYs5lrzHsvy8N", "5",
                    "payment")
        add_product("subscription-test", "price_1MjOq1K4xeIGYs5lvqNSB9l5", "15",
                    "subscription")
        connection = sqlite3.connect('database.db')
        cur = connection.cursor()

        #Fetch products from database
        t1 = cur.execute(
            '''SELECT productName FROM products 
        WHERE priceId LIKE ?''', ['price_1MjOpSK4xeIGYs5lrzHsvy8N']).fetchall()
        t2 = cur.execute(
            '''SELECT productName FROM products
        WHERE priceId LIKE ?''', ['price_1MjOq1K4xeIGYs5lvqNSB9l5']).fetchall()
        connection.close()

        #Assert correct products
        self.assertEqual(t1[0][0], "product-test")
        self.assertEqual(t2[0][0], "subscription-test")

    #test changePrice
    def test_change_price(self):
        #initialise database
        init_database()

        #Add test products to the databse
        add_product("product-test", "price_1MjOpSK4xeIGYs5lrzHsvy8N", "5",
                    "payment")

        #Update price of product
        change_price(10, "product-test")

        connection = sqlite3.connect('database.db')
        cur = connection.cursor()

        #Fetch product price from database
        t1 = cur.execute(
            '''SELECT priceID, price FROM products 
        WHERE productName LIKE ?''', ['product-test']).fetchone()
        connection.close()

        #Fetch product price from stripe
        stripePrice = stripe.Price.retrieve(t1[0])

        #Assert correct price
        self.assertEqual(t1[1], "10")
        self.assertEqual(stripePrice.unit_amount, 10)

        #Reset price
        change_price(5, "product-test")

    #test createCheckout()
    def test_create_checkout_success(self):
        #initialise Database
        init_database()

        #Create temp new customer on stripe
        newCustomer = stripe.Customer.create()

        #Add test product to payments service
        add_product("product-test", "price_1MjOpSK4xeIGYs5lrzHsvy8N", "5",
                    "payment")

        #Assert valid checkout URL response
        session_url = create_checkout(newCustomer.stripe_id, "product-test")
        session_code = urllib.request.urlopen(session_url).getcode()
        self.assertEqual(session_code, 200)

        #Delete temp customer
        stripe.Customer.delete(newCustomer.stripe_id)

    #test customerPortal
    def test_customer_portal(self):
        #initialise Database
        init_database()

        #Create temp new customer on stripe
        newCustomer = stripe.Customer.create()

        #Add customer to database with '111' as ID
        add_customer(111, newCustomer.stripe_id)

        #Assert valid portal URL response
        session_url = get_payment_manager(111)
        session_code = urllib.request.urlopen(session_url).getcode()
        self.assertEqual(session_code, 200)

        #Delete temp customer
        stripe.Customer.delete(newCustomer.stripe_id)


#test makePurchase()
#def test_make_purchase(self):

#test get_index()

    def test_get_index(self):
        """Test if the get_index() function returns a 200 status code"""
        file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "test_index.html"))

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
    def setUpClass(self):
        """Create a new app instance and set up a test client"""
        self.app = app.test_client()
        self.app.testing = True

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
