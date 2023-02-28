'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import stripe
from flask import Flask
# test
app = Flask(__name__)

stripe.api_key = "apikey"
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
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2024,
    "cvc": "123"
}

stripe.checkout.Session.create(
    success_url = 'https://example.com/',
    mode = "subscription",
    line_items = [{
        "quantity": 1,
        "price": "price_1MgZPvDun2r5uAIS4e80HNl5",
    }],
)

@app.route("/checkout-session", methods=['POST'])
def createCheckout():
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

