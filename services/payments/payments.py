'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import stripe
from flask import Flask

app = Flask(__name__)

stripe.api_key = "APIKEY"
stripe.product.create(
    #To Do: create products for bookings and subscriptions
)
stripe.price.create(
    #To Do: create prices for annual and monthly memberships
    #and bookings
)

@app.route("/checkout-session", methods=['POST'])
def createCheckout():
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

