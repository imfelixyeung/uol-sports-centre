'''Unit testing for payments microservice'''
import unittest
import sqlite3
# import os

# import urllib.request
# import stripe

from config import DATABASE_SCHEMA_TEST_URL, DATABASE_URL

# from app import app
# from app.payments import get_payment_manager, make_a_purchase
# from app.database import (init_database, add_product, add_customer,
#                             get_purchases, delete_product, update_price,
#                             delete_customer)
# from app.interfaces import create_checkout


def create_test_database():
    """Createst the database for the tests"""
    connection = sqlite3.connect(DATABASE_URL)
    with open(DATABASE_SCHEMA_TEST_URL, encoding="utf-8") as schema:
        connection.executescript(schema.read())
    connection.close()


class TestingPaymentsMicroservice(unittest.TestCase):
    """Testing the payments microservice"""

    # def setUp(self):
    #     app.testing = True
    #     self.client = app.test_client()
    #     self.product_name = "product-test"
    #     self.product_price = 50.00
    #     self.user_id = 467468

    # def test_make_purchasable(self):
    #     """tests if it can make a test product purchasable"""
    #     #payments.MakePurchasable('product-test', 5.0, 'test-type')

    #     #retrieving the added product from Stripe
    #     products = stripe.Product.list()
    #     product_stripe = next(
    #         (p for p in products if p.name == "subscription-test"), None)
    #     price = stripe.Price.list(limit=1, product=product_stripe.id).data[0]

    #     #asserting that the added product matches the expected result
    #     self.assertEqual(product_stripe.name, "subscription-test")
    #     self.assertEqual(price.unit_amount_decimal, "1500")


    # def test_make_a_purchase(self):
    #     """tests if a purchase can be made correctly"""
    #     init_database()

    #     #Add test products to database
    #     add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")
    #     add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15",
    #                 "subscription")

    #     #Make a new temp customer on Stripe
    #     new_customer = stripe.Customer.create()

    #     #Add customer to database
    #     add_customer(111, new_customer.stripe_id)

    #     #Make a purchase with multiple products
    #     products = ["product-test", "subscription-test"]
    #     make_a_purchase(111, products, "subscription")

    #     #Check if products added
    #     purchased_products = get_purchases(111)
    #     self.assertEqual(len(purchased_products), 2)

    #     #Delete temp customer
    #     stripe.Customer.delete(new_customer.stripe_id)
    #     delete_customer(111, new_customer.stripe_id)

    #     delete_product("prod_NUNazbUQcwZQaU")
    #     delete_product("prod_NUNbPMJPMIEvWk")


    # def test_add_product(self):
    #     """Testing the functionality of adding products"""
    #     init_database()

    #     #Add test products to the database
    #     add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")
    #     add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15",
    #                 "subscription")
    #     connection = sqlite3.connect(DATABASE_URL)
    #     cur = connection.cursor()

    #     #Fetch products from database
    #     test_1 = cur.execute(
    #         """SELECT productName FROM products
    #     WHERE productId LIKE ?""", ["prod_NUNazbUQcwZQaU"]).fetchall()
    #     test_2 = cur.execute(
    #         """SELECT productName FROM products
    #     WHERE productId LIKE ?""", ["prod_NUNbPMJPMIEvWk"]).fetchall()
    #     connection.close()

    #     #Assert correct products
    #     self.assertEqual(test_1[0][0], "product-test")
    #     self.assertEqual(test_2[0][0], "subscription-test")

    #     delete_product("prod_NUNazbUQcwZQaU")
    #     delete_product("prod_NUNbPMJPMIEvWk")


    # def test_change_price(self):
    #     """Tests the change price functionality"""
    #     #initialise database
    #     init_database()

    #     #Add test products to the databse
    #     add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")

    #     #Update price of product
    #     update_price("product-test", "10")

    #     connection = sqlite3.connect(DATABASE_URL)
    #     cur = connection.cursor()

    #     #Fetch product price from database
    #     test_1 = cur.execute(
    #         '''SELECT productID, price FROM products
    #     WHERE productName LIKE ?''', ["product-test"]).fetchone()
    #     connection.close()

    #     #Assert correct price
    #     self.assertEqual(test_1[1], "10")

    #     # Delete added product
    #     delete_product("prod_NUNazbUQcwZQaU")


    # def test_create_checkout_success(self):
    #     """Tests the create checkout functionality for the success case"""
    #     #initialise Database
    #     init_database()

    #     #Create temp new customer on stripe
    #     new_customer = stripe.Customer.create()

    #     #Add test product to payments service
    #     add_product("product-test", "prod_NUNazbUQcwZQaU", "5", "session")

    #     #Assert valid checkout URL response
    #     session_url = create_checkout(new_customer.stripe_id, "product-test")

    #     with urllib.request.urlopen(session_url) as response:
    #         self.assertEqual(response.getcode(), 200)

    #     #Delete temp customer
    #     stripe.Customer.delete(new_customer.stripe_id)

    # def test_customer_portal(self):
    #     """Tests the customer portal functionality"""
    #     #initialise Database
    #     init_database()

    #     #Create temp new customer on stripe
    #     new_customer = stripe.Customer.create()

    #     #Add customer to database with '111' as ID
    #     add_customer(111, new_customer.stripe_id)

    #     #Assert valid portal URL response
    #     session_url = get_payment_manager(111)
    #     with urllib.request.urlopen(session_url) as response:
    #         self.assertEqual(response.getcode(), 200)

    #     #Delete temp customer
    #     stripe.Customer.delete(new_customer.stripe_id)

    # def test_get_index(self):
    #     """Test if the get_index() function returns a 200 status code"""
    #     file_path = os.path.abspath(
    #         os.path.join(os.path.dirname(__file__), "test_index.html"))

    #     with open(file_path, encoding="utf-8") as file:
    #         html = file.read()
    #     response = self.client.get("/")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("text/html", response.content_type)
    #     self.assertEqual(response.data.decode("utf-8"), html)

    #test redirectCheckout()
    #def redirectCheckout_test(self):
    # a = 1

    #test webhookReceived()
    #def webhookReceived_test(self):
    #a = 1

    # @classmethod
    # def tearDownClass(cls):
    #     """Remove the database file after running all tests"""
    #     conn = sqlite3.connect(DATABASE_URL)
    #     conn.execute("DROP TABLE IF EXISTS orders")
    #     conn.execute("DROP TABLE IF EXISTS products")
    #     conn.execute("DROP TABLE IF EXISTS customers")
    #     conn.commit()
    #     conn.close()


if __name__ == "__main__":
    unittest.main()
