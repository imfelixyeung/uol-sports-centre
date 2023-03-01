'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import stripe
import os
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, redirect, render_template
# test
app = Flask(__name__,
            static_url_path='',
            static_folder='public')

dotenv_path = Path('../.env')
load_dotenv(dotenv_path=dotenv_path)
print(os.getenv('APP_PORT'))
localDomain = 'http://localhost:' + os.getenv('APP_PORT')

stripe.api_key = os.getenv('STRIPE_API')
#stripe.product.create(
    #To Do: create products for bookings and subscriptions
#)
#stripe.price.create(
    #To Do: create prices for annual and monthly memberships
    #and bookings
#)

#Creating a test customer - this will be retrived from user microservice
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

#stripe.checkout.Session.create(
    #success_url = 'https://example.com/',
    #mode = "subscription",
    #line_items = [{
        #"quantity": 1,
        #"price": "priceKey",
    #}],
#)

@app.route('/', methods=['GET'])
def get_index():
    return render_template('index.html')

@app.route("/checkout-session", methods=['POST'])
def createCheckout():
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''
    checkoutSession = stripe.checkout.Session.create(
        success_url=localDomain + '/index.html',
        mode = 'subscription',
        line_items=[
        {
            "price": "price_1MgV8AEFmvAnvjKIvysiJpuy",
            "quantity": 1
        },],
    )
    return redirect(checkoutSession.url, code=303)

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('APP_PORT'))

