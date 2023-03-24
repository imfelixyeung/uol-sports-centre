"""Payments Microservice:
Provides functionality for making payments for subscriptions"""
from datetime import datetime
from dateutil.relativedelta import relativedelta
import stripe
from stripe import error as stripe_errors
from flask import request, jsonify, redirect, render_template

from app import app
from app.database import (check_health, get_purchases, add_purchase,
                          update_expiry, get_purchase, delete_order, get_sales,
                          get_pricing_lists)
from app.payments import (make_a_purchase, get_payment_manager, apply_discount,
                          change_price, change_discount_amount,
                          cancel_subscription)

import env

stripe.api_key = env.STRIPE_API_KEY


@app.route("/", methods=["GET"])
def get_index():
  """Gets the index for which it shows a subscription for now"""
  # add_product("product-test", "price_1MnuZyK4xeIGYs5lFGnbcNZm", "15",
  #   "subscription")
  #add_product("product-2", "prod_NWxpESI1EH6kFJ", "15", "subscription")
  #add_customer(467468, stripe.Customer.create().stripe_id)
  return render_template("index.html")


@app.route("/discount/apply", methods=["POST"])
def get_discount(product_name, membership):
  """Get the discounted product's price after applying a discount to it"""
  return jsonify(apply_discount(product_name, membership))


@app.route("/management/discount/change/<int:amount>", methods=["GET"])
def change_discount(amount):
  """Retrieves the new discount amount and changes it"""
  return jsonify(change_discount_amount(amount))


@app.route("/management/sales/<string:product_type>", methods=["GET"])
def get_sales_lastweek(product_type: str):
  """Function that retrieves the sales from the last 
    7 days for a given product type"""
  return jsonify(get_sales(product_type))


@app.route("/checkout-session/<int:user_id>", methods=["POST"])
def redirect_checkout(user_id, products, payment_mode):
  """It redicrects the checkout"""
  #products = ["product-test"]
  #payment_mode = "payment"
  return make_a_purchase(user_id, products, payment_mode)


@app.route("/webhook", methods=["POST"])
def webhook_received():
  """Provisions purchased product to user, after successful payment"""
  event = None
  signature = request.headers.get("stripe-signature")

  if not signature:
    return {"message": "signature missing"}

  #Stripe signature verification
  try:
    event = stripe.Webhook.construct_event(payload=request.data,
                                           sig_header=signature,
                                           secret=env.STRIPE_WEBHOOK_KEY)
  except ValueError as payload_error:
    #Invalid Payload
    return jsonify({"Invalid Payload": str(payload_error)}), 400
  except stripe_errors.SignatureVerificationError as signature_error:
    #Invalid Signature
    return jsonify({"Invalid Signature": str(signature_error)}), 400

  if event.type == "checkout.session.completed":
    session = stripe.checkout.Session.retrieve(
        event.data.object.id,
        expand=["line_items"],
    )

    transaction_time = str(datetime.now())
    expiry_time = str(datetime.now() + relativedelta(months=1))
    for purchased_item in session.line_items.data:
      item_type = stripe.Product.retrieve(purchased_item.price.product).object
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
        update_expiry(customer, product,
                      str(datetime.now() + relativedelta(months=expiry)))
  elif event.type == "customer.subscription.deleted":
    #Remove subscription from user
    subscription = event.data.object
    customer = subscription.customer
    product = subscription.items.data[1].price.product
    update_expiry(customer, product, str(datetime.now()))
  return "ok"


@app.route("/purchased-products/<int:user_id>", methods=["GET"])
def get_purchased_products(user_id: int):
  """Retrieve all purchased products for a given user"""
  purchased_products = get_purchases(user_id)
  return jsonify(purchased_products)


@app.route("/customer-portal/<int:user_id>", methods=["GET"])
def customer_portal(user_id: int):
  """Generate a Stripe customer portal URL for the current user"""
  return redirect(get_payment_manager(user_id), code=303)


@app.route("/change-price", methods=["POST"])
def change_product_price():
  """End point for changing the price for managemnet uses"""
  # Getting the new price and product name
  data = request.get_json()

  new_price = data["new_price"]
  product_name = data["product_name"]

  # Calling the change_price function
  change_price(new_price, product_name)

  return {"message": "Price changed successfully"}


@app.route("/get-prices/<string:product_type>", methods=["GET"])
def get_prices(product_type: str):
  """Retrieve pricing list of specified product type"""
  return jsonify(get_pricing_lists(product_type))


@app.route("/cancel-membership/<int:user_id>", methods=["GET"])
def cancel_membership(user_id: int):
  """Cancels existing membership for the given user"""
  return jsonify(cancel_subscription(user_id))


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
  except stripe_errors.StripeError as refund_error:
    return jsonify({"error": str(refund_error)}), 400

  # For now, delete order
  delete_order(order_id)

  return jsonify({"message": "Refund processed successfully."}), 200


@app.route("/health")
def get_health():
  """Gets the health of the microservice"""
  return {"status": "healthy" if check_health() else "degraded"}
