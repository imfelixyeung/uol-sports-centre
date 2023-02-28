'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import stripe
from flask import Flask
# test
app = Flask(__name__)

stripe.api_key = "test_key"
#stripe.product.create(
    #To Do: create products for bookings and subscriptions
#)
#stripe.price.create(
    #To Do: create prices for annual and monthly memberships
    #and bookings
#)

#Creating a test customer
customer = stripe.Customer.create(
    email = "examplecustomer@example.com",
    name = "Minoru Kishinami"
)

#Creating a test card for our use
card = {
    "number": "1234567890123456",
    "exp_month": 12,
    "exp_year": 2024,
    "cvc": "123"
}

@app.route("/checkout-session", methods=['POST'])
def createCheckout():
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

