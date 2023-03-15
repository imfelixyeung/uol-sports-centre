"""Payments Microservice:
Provides functionality for making payments for subscriptions"""
import os
from datetime import datetime
import stripe

from database import init_database
from database import add_customer
from database import add_product
from database import get_purchases
from database import add_purchase

from payments import make_a_purchase
from payments import get_payment_manager

from dotenv import load_dotenv
from flask import Flask, json, request, jsonify, redirect, render_template

app = Flask(__name__, static_url_path="", static_folder="public")

# Get absolute path of directory where .env is
dirtoenv = os.path.dirname(os.path.abspath(__file__))

# Load .env file from base directory
load_dotenv(os.path.join(dirtoenv, ".env"))

stripe.api_key = os.getenv("STRIPE_API")

#Creating a test card for our use
card = {
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2024,
    "cvc": "123"
}


@app.route("/", methods=["GET"])
def get_index():
    """Gets the index for which it shows a subscription for now"""
    init_database()
    add_customer(467468, stripe.Customer.create().stripe_id)
    add_product("subscription-test", "prod_NUNbPMJPMIEvWk", "15",
                "subscription")
    #add_product("product-2", "prod_NWxpESI1EH6kFJ", "15", "subscription")
    return render_template("index.html")


@app.route("/checkout-session", methods=["POST"])
def redirect_checkout():
    """It redicrects the checkout"""
    products = ["subscription-test"]
    payment_mode = "subscription"
    return make_a_purchase(467468, products, payment_mode)


@app.route("/webhook", methods=["POST"])
def webhook_received():
    """Provisions purchased product to user, after successful payment"""

    # pylint: disable=line-too-long
    webhook_secret = "whsec_de3f267a8bf26130bdfb026bf70488c16ce2dcaa63ddec8dd807ac408d63af8a"
    # pylint: enable=line-too-long

    request_data = json.loads(request.data)
    if webhook_secret:
        signature = request.headers.get("stripe-signature")
        event = stripe.Webhook.construct_event(payload=request.data,
                                               sig_header=signature,
                                               secret=webhook_secret)
        event_type = event["type"]

    else:
        event_type = request_data["type"]

    if event_type == "checkout.session.completed":
        session = stripe.checkout.Session.retrieve(
            event["data"]["object"]["id"],
            expand=["line_items"],
        )

        purchased_item = session.line_items.data[0]
        add_purchase(session.customer, purchased_item.price.product,
                     str(datetime.now()))
        print("Payment succeeded!")
    return "ok"


# Endpoint to retreieve purchased products for a customer
@app.route("/purchased-products/<int:userID>", methods=["GET"])
def get_purchased_products(user_id):
    """Retrieve all purchased products for a given user"""
    purchased_products = get_purchases(user_id)
    return jsonify(purchased_products)


@app.route("/customer-portal", methods=["GET"])
def customer_portal():
    """Generate a Stripe customer portal URL for the current user"""
    return redirect(get_payment_manager(467468), code=303)


@app.route("/health")
def get_health():
    """Gets the health of the microservice"""
    # if service_healthy:
    #     return 200
    # else:
    #     return "not ok", 500
    pass


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("APP_PORT"))
