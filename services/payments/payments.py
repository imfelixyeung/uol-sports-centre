'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import sqlite3
import stripe
import os
from dotenv import load_dotenv
from flask import Flask, redirect, render_template

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

# Get absolute path of directory where .env is 
dirtoenv = os.path.dirname(os.path.abspath(__file__))

# Load .env file from base directory
load_dotenv(os.path.join(dirtoenv, '.env'))

localDomain = 'http://localhost:' + os.getenv('APP_PORT')

stripe.api_key = os.getenv('STRIPE_API')

def addProductDatabase(name, priceID, price, type):
    '''Adds a new product to the database'''
    connection = sqlite3.connect('database.db')
    with open('services/payments/paymentSchema.sql') as schema:
        connection.executescript(schema.read())
    
    cur = connection.cursor()
    cur.execute("INSERT INTO products VALUES (?, ?, ?, ?)",
            (name, priceID, price, type))
    connection.commit()
    connection.close()

def MakePurchasable(productName, productPrice, productType="product"):
    '''Make a chosen product purchasable through adding to stripe and DB'''

    #Adding product to stripe
    productStripe = stripe.Product.create(name=productName)
    price = stripe.Price.create(
        unit_amount_decimal=productPrice,
        currency="gbp",
        product=productStripe.stripe_id
    )

    #Adding product to database
    addProductDatabase(productName, price.stripe_id, productPrice, productType)

    #DB Test (will be a part of unit tests)
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    products = cur.execute('SELECT * FROM products').fetchall()
    print(products[0])
    con.close()

def MakeAPurchase(userID, productName):
    '''redirects user to stripe checkout for chosen product'''

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
    return checkoutSession.url

@app.route('/', methods=['GET'])
def get_index():
    MakePurchasable("Booking1", "10.99")
    return render_template('index.html')

@app.route("/checkout-session", methods=['POST'])
def redirectCheckout():
    return redirect(createCheckout(), code=303)

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

@app.route('/health')
def get_health():
    if service_healthy:
        return 'ok'
    else:
        return 'not ok', 500

if __name__ == '__main__':
    app.run(host='localhost', port=os.getenv('APP_PORT'))





