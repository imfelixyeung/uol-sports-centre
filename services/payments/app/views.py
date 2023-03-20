"""Payments Microservice:
Provides functionality for making payments for subscriptions"""
from datetime import datetime
from dateutil.relativedelta import relativedelta
import stripe
from flask import request, jsonify, redirect, render_template

from app import app
from app.database import (check_health, add_customer, get_purchases,
                          add_purchase, update_expiry, get_purchase,
                          delete_order)
from app.payments import make_a_purchase, get_payment_manager, apply_discount, change_price

import env

stripe.api_key = env.STRIPE_API_KEY


@app.route("/", methods=["GET"])
def get_index():
    """Gets the index for which it shows a subscription for now"""
    add_customer(467468, stripe.Customer.create().stripe_id)
    return render_template("index.html")


@app.route("/apply-discount", methods=["POST"])
def get_discount(product_name, discount_code):
    """Get the discounted product's price after applying a discount to it"""
    return apply_discount(product_name, discount_code)


@app.route("/checkout-session", methods=["POST"])
def redirect_checkout(products, payment_mode):
    """It redicrects the checkout"""
    return make_a_purchase(467468, products, payment_mode)


@app.route("/webhook", methods=["POST"])
def webhook_received():
    """Provisions purchased product to user, after successful payment"""

    signature = request.headers.get("stripe-signature")
    event = stripe.Webhook.construct_event(payload=request.data,
                                           sig_header=signature,
                                           secret=env.STRIPE_WEBHOOK_KEY)

    if event.type == "checkout.session.completed":
        session = stripe.checkout.Session.retrieve(
            event.data.object.id,
            expand=["line_items"],
        )

        transaction_time = str(datetime.now())
        expiry_time = str(datetime.now() + relativedelta(months=1))
        for purchased_item in session.line_items.data:
            item_type = stripe.Product.retrieve(
                purchased_item.price.product).object
            if item_type == "subscription":
                add_purchase(session.customer, purchased_item.price.product,
                             transaction_time, expiry_time)
            else:
                add_purchase(session.customer, purchased_item.price.product,
                             transaction_time)
        print("Payment succeeded!")

    elif event.type == "invoice.paid":
        #Renews exipry of purchased subscription when paid
        invoice = event.data.object
        customer = invoice.customer
        for item in invoice.lines.data:
            product = item.price.product
            if stripe.Product.retrieve(product).object == "subscription":
                expiry = 1
                if item.price.recurring.interval == "year":
                    expiry = 12
                update_expiry(
                    customer, product,
                    str(datetime.now() + relativedelta(months=expiry)))
    elif event.type == "customer.subscription.deleted":
        #Remove subscription from user
        print("Subscription deleted")
    return "ok"


@app.route("/purchased-products/<int:userID>", methods=["GET"])
def get_purchased_products(user_id: int):
    """Retrieve all purchased products for a given user"""
    purchased_products = get_purchases(user_id)
    return jsonify(purchased_products)


@app.route("/customer-portal", methods=["GET"])
def customer_portal():
    """Generate a Stripe customer portal URL for the current user"""
    return redirect(get_payment_manager(467468), code=303)


@app.route("/change-price", methods=["POST"])
def change_product_price():
    """End point for changing the price for managemnet uses"""
    # Getting the new price and product name
    data = request.get_json()

    new_price = data["new_price"]
    product_name = data["product_name"]

    # Calling the change_price function
    change_price(new_price, product_name)

    return 200


@app.route("/refund", methods=["POST"])
def refund():
    """Endpoint to process refunds"""

    #Get the orderID and amount to refund frmo the request data
    data = request.get_json()

    order_id = data.get("order_id")
    refund_amount = data.get("refund_amount")

    # Retrieve the purchase information from the database
    purchase = get_purchase(order_id)

    # Checks if the purchase exists
    if not purchase:
        return jsonify({"error": "Purchase not found."}), 404

    # Refund the payment using Stripe API
    try:
        stripe.Refund.create(
            payment_intent=purchase["payment_intent"],
            amount=refund_amount,
            refund_application_fee=True,
        )
    except stripe.error.StripeError as refund_error:
        return jsonify({"error": str(refund_error)}), 400

    # For now, delete order
    delete_order(order_id)

    return jsonify({"message": "Refund processed successfully."}), 200


@app.route("/health")
def get_health():
    """Gets the health of the microservice"""
    return {"status": "healthy" if check_health() else "degraded"}
