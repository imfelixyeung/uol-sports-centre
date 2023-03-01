'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import stripe
from flask import Flask, current_app, render_template, redirect
# test
app = Flask(__name__)

localDomain = 'http://localhost:5000'

stripe.api_key = "apikey"
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
        successUrl = "paymentSuccessPage",
        mode = 'subscription',
        line_items=[
        {
            "price": "priceKey",
            "quantity": 1
        },],
    )
    return redirect(checkoutSession.url, code=303)

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

if __name__ == '__main__':
    app.run(host='0.0.0.0')

