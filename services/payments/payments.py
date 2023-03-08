'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import sqlite3
import stripe
import os
from datetime import datetime
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

def initDatabase():
    '''Initialise database from schema'''
    connection = sqlite3.connect('database.db')
    with open('services/payments/paymentSchema.sql') as schema:
        connection.executescript(schema.read())
    connection.close()

def addProductDatabase(name, priceID, price, type):
    '''Adds a new product to the database'''
    connection = sqlite3.connect('database.db')
    cur = connection.cursor()
    cur.execute("INSERT INTO products VALUES (?, ?, ?, ?)",
            (priceID, name, price, type))
    productID = cur.lastrowid
    connection.commit()
    connection.close()
    return productID

def MakePurchasable(productName, productPrice, productType="payment"):
    '''Make a chosen product purchasable through adding to stripe and DB'''

    #Adding product to stripe
    productStripe = stripe.Product.create(name=productName)
    price = stripe.Price.create(
        unit_amount_decimal=str(productPrice * 100),
        currency="gbp",
        product=productStripe.stripe_id
    )
    #Adding product to database
    addProductDatabase(productName, price.stripe_id, productPrice, productType)

def MakeAPurchase(userID, productName):
    '''redirects user to stripe checkout for chosen product'''
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    findUser = cur.execute('''SELECT stripeID FROM customers WHERE
    userID = ?''', [userID]).fetchall()
    if len(findUser) == 0:
        newCustomer = stripe.Customer.create(
            #get user details from user microservice
        )
        cur.execute("INSERT INTO customers VALUES (?, ?)",
            (userID, newCustomer.stripe_id))
        con.commit()
        findUser = cur.execute('''SELECT stripeID FROM customers WHERE
        userID = ?''', [userID]).fetchall()
        
    # Gets the product ID from the products table
    product = cur.execute('SELECT * FROM products WHERE productName=?', [productName]).fetchone()   
    productID = product[0]
    
    # Creates a new row in the purchased products table
    cur.execute("INSERT INTO orders (customerID, productID, purchaseDate) VALUES (?, ?, ?)",
                (findUser[0][0], productID, datetime.now()))
    con.commit()
    con.close()

    return createCheckout(findUser[0][0], productName)

#Creating a test card for our use
card = {
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2024,
    "cvc": "123"
}

def createCheckout(stripeID, productName):
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    products = cur.execute('''SELECT priceId, productType FROM products WHERE 
    productName LIKE ?''', [productName]).fetchall()

    if not products:
        # handle the case where no products were found
        con.close()
        return None

    checkoutSession = stripe.checkout.Session.create(
        success_url=localDomain + '/index.html',
        mode = products[0][1],
        expires_at=int(datetime.timestamp(datetime.now())) + 1800,
        customer=stripeID,
        line_items=[
        {
            "price": products[0][0],
            "quantity": 1
        },],
    )
    con.close()
    return checkoutSession.url

@app.route('/', methods=['GET'])
def get_index():
    initDatabase()
    return render_template('index.html')

@app.route("/checkout-session", methods=['POST'])
def redirectCheckout():
    return redirect(MakeAPurchase(467468, "Sports Centre Membership"), code=303)

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''

# Endpoint to retreieve purchased products for a customer
@app.route('/purchased-products/<int:userID>', methods=['GET'])
def get_purchased_products(userID):
    '''Retrieve all purchased products for a given user'''
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    purchased_products = cur.execute('''SELECT * FROM purchased_products
                                        JOIN products ON purchased_products.productID = products.productID
                                        WHERE purchased_products.customerID = ?''',
                                     [userID]).fetchall()
    con.close()
    return jsonify(purchased_products)

@app.route('/customer-portal', methods=['GET'])
def customerPortal():
    # Get the Stripe customer ID for the current user from the database
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    stripe_customer_id = cur.execute(
        'SELECT stripeID FROM customers WHERE userID = ?', [467468]
    ).fetchone()[0]
    con.close()

    # Generate a Stripe customer portal URL for the current user
    customer_portal_session = stripe.billing_portal.Session.create(
        customer=stripe_customer_id,
        return_url=localDomain + '/index.html'
    )

    # Redirect the user to the customer portal URL
    return redirect(customer_portal_session.url, code=303)

@app.route('/health')
def get_health():
    if service_healthy:
        return 200
    else:
        return 'not ok', 500

if __name__ == '__main__':
    app.run(host='localhost', port=os.getenv('APP_PORT'))

