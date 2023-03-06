import unittest
import sqlite3
import stripe

import sys
from pathlib import Path
sys.path[0] = str(Path(sys.path[0]).parent)

import payments
from payments import app
from payments import MakePurchasable

class TestingPaymentsMicroservice(unittest.TestCase):
    #test createCheckout()    
    def test_MakePurchasable_test(self):
        #tests if it can make a test product purchasable
        payments.MakePurchasable('product-test', 5.0, 'test-type')

        #retrieving the added product from Stripe
        products = stripe.Product.list()
        productStripe = next((p for p in products if p.name == 'product-test'), None)

        price = stripe.Price.list(limit=1, product=productStripe.id).data[0]

        #asserting that the added product matches the expected result
        self.assertEqual(productStripe.name, 'product-test')
        self.assertEqual(price.unit_amount_decimal, '500')

    #test addProductDatabase()    
    def addProductDatabase_test(self):
        a = 1

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