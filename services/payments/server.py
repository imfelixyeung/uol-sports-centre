'''Payments Microservice:
Provides functionality for making payments for subscriptions'''
import stripe
import os
from database import *
from payments import *
from dotenv import load_dotenv
from flask import * 

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

# Get absolute path of directory where .env is 
dirtoenv = os.path.dirname(os.path.abspath(__file__))

# Load .env file from base directory
load_dotenv(os.path.join(dirtoenv, '.env'))

stripe.api_key = os.getenv('STRIPE_API')

#Creating a test card for our use
card = {
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2024,
    "cvc": "123"
}

@app.route('/', methods=['GET'])
def get_index():
    initDatabase()
    addCustomer(467468, stripe.Customer.create().stripe_id)
    addProduct('subscription-test', 'price_1MjOq1K4xeIGYs5lvqNSB9l5', '15', 'subscription')
    return render_template('index.html')

@app.route("/checkout-session", methods=['POST'])
def redirectCheckout():
    return redirect(MakeAPurchase(467468, "subscription-test"), code=303)

@app.route('/webhook', methods=['POST'])
def webhookReceived():
    '''Provisions purchased product to user, after successful payment'''
    
    webhook_secret = 'whsec_de3f267a8bf26130bdfb026bf70488c16ce2dcaa63ddec8dd807ac408d63af8a'
    request_data = json.loads(request.data)
    if webhook_secret:
        signature = request.headers.get('stripe-signature')
        event = stripe.Webhook.construct_event(
            payload=request.data, sig_header=signature, secret=webhook_secret)
        event_type = event['type']
        
    else:
        event_type = request_data['type']
    
    if event_type == 'checkout.session.completed':
        session = stripe.checkout.Session.retrieve(
            event['data']['object']['id'],
            expand=['line_items'],
        )

        purchasedItem = session.line_items.data[0]
        addPurchase(session.customer, purchasedItem.price.id, str(datetime.now()))
        print('Payment succeeded!')
    
    return 'ok'

# Endpoint to retreieve purchased products for a customer
@app.route('/purchased-products/<int:userID>', methods=['GET'])
def get_purchased_products(userID):
    '''Retrieve all purchased products for a given user'''
    purchased_products = getPurchases(userID)
    return jsonify(purchased_products)

@app.route('/customer-portal', methods=['GET'])
def customerPortal():
    # Generate a Stripe customer portal URL for the current user
    return redirect(getPaymentManager(467468), code=303)

@app.route('/health')
def get_health():
    if service_healthy:
        return 200
    else:
        return 'not ok', 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('APP_PORT'))

