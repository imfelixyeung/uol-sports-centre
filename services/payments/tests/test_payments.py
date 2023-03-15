'''Unit testing for payments microservice'''
import unittest
import sqlite3
import os

import urllib.request
import stripe

from path import sys

from server import app

from payments import change_price
from payments import get_payment_manager

from database import init_database
from database import add_product
from database import add_customer

from interfaces import create_checkout

def create_test_database():
    """Createst the database for the tests"""
    connection = sqlite3.connect("database.db")
    with open("paymentTestSchema.sql", encoding="utf-8") as schema:
        connection.executescript(schema.read())
    connection.close()


class TestingPaymentsMicroservice(unittest.TestCase):
    """Testing the payments microservice"""

    def setUp(self):
        app.testing = True
        self.client = app.test_client()
        self.product_name = "product-test"
        self.product_price = 50.00
        self.user_id = 467468

    def test_make_purchasable_test(self):
        """tests if it can make a test product purchasable"""
        #payments.MakePurchasable('product-test', 5.0, 'test-type')

        #retrieving the added product from Stripe
        products = stripe.Product.list()
        product_stripe = next((p for p in products if p.name == "product-test"),
                              None)
        price = stripe.Price.list(limit=1, product=product_stripe.id).data[0]

        #asserting that the added product matches the expected result
        self.assertEqual(product_stripe.name, "product-test")
        self.assertEqual(price.unit_amount_decimal, "500")

    def test_add_product(self):
        """Testing the functionality of adding products"""
        init_database()

        #Add test products to the databse
        add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "payment")
        add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15",
                    "subscription")
        connection = sqlite3.connect("database.db")
        cur = connection.cursor()

        #Fetch products from database
        test_1 = cur.execute(
            """SELECT productName FROM products 
        WHERE productId LIKE ?""", ["prod_NUNazbUQcwZQaU"]).fetchall()
        test_2 = cur.execute(
            """SELECT productName FROM products
        WHERE productId LIKE ?""", ["prod_NUNbPMJPMIEvWk"]).fetchall()
        connection.close()

        #Assert correct products
        self.assertEqual(test_1[0][0], "product-test")
        self.assertEqual(test_2[0][0], "subscription-test")

    def test_change_price(self):
        """Tests the change price functionality"""
        #initialise database
        init_database()

        #Add test products to the databse
        add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "payment")

        #Update price of product
        change_price(10, "product-test")

        connection = sqlite3.connect("database.db")
        cur = connection.cursor()

        #Fetch product price from database
        test_1 = cur.execute(
            '''SELECT productID, price FROM products 
        WHERE productName LIKE ?''', ["product-test"]).fetchone()
        connection.close()

        #Fetch product price from stripe
        stripe_price = stripe.Price.retrieve(
            stripe.Product.retrieve(test_1[0]).default_price)

        #Assert correct price
        self.assertEqual(test_1[1], "10")
        self.assertEqual(stripe_price.unit_amount, 1000)

        #Reset price
        change_price(5, "product-test")

    def test_create_checkout_success(self):
        """Tests the create checkout functionality for the success case"""
        #initialise Database
        init_database()

        #Create temp new customer on stripe
        new_customer = stripe.Customer.create()

        #Add test product to payments service
        add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "payment")

        #Assert valid checkout URL response
        session_url = create_checkout(new_customer.stripe_id, "product-test")
        session_code = urllib.request.urlopen(session_url).getcode()
        self.assertEqual(session_code, 200)

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
        session_code = urllib.request.urlopen(session_url).getcode()
        self.assertEqual(session_code, 200)

        #Delete temp customer
        stripe.Customer.delete(new_customer.stripe_id)

    def test_get_index(self):
        """Test if the get_index() function returns a 200 status code"""
        file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "test_index.html"))

        with open(file_path, encoding="utf-8") as file:
            html = file.read()
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("text/html", response.content_type)
        self.assertEqual(response.data.decode("utf-8"), html)

    #test redirectCheckout()
    #def redirectCheckout_test(self):
    # a = 1

    #test webhookReceived()
    #def webhookReceived_test(self):
    #a = 1

    @classmethod
    def setUpClass(self):
        """Create a new app instance and set up a test client"""
        self.app = app.test_client()
        self.app.testing = True

    @classmethod
    def tearDownClass(cls):
        """Remove the database file after running all tests"""
        conn = sqlite3.connect("database.db")
        conn.execute("DROP TABLE IF EXISTS orders")
        conn.execute("DROP TABLE IF EXISTS products")
        conn.execute("DROP TABLE IF EXISTS customers")
        conn.commit()
        conn.close()


if __name__ == "__main__":
    unittest.main()
