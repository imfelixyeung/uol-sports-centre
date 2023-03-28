"""Payments Microservice:
Provides functionality for making payments for products"""
from datetime import datetime
from dateutil.relativedelta import relativedelta
import requests
import jwt
import stripe
from stripe import error as stripe_errors
from flask import request, jsonify, redirect, make_response

from app import app
from app.database import (check_health, get_purchases, add_purchase,
                          update_expiry, delete_order, get_sales,
                          get_pricing_lists, get_order, get_user,
                          get_user_from_stripe, get_product, get_pending,
                          delete_pending)
from app.payments import (make_a_purchase, get_payment_manager, change_price,
                          change_discount_amount, cancel_subscription,
                          make_purchasable)

import env

stripe.api_key = env.STRIPE_API_KEY


@app.route("/discount/change/<int:amount>", methods=["GET"])
def change_discount(amount):
  """Retrieves the new discount amount and changes it"""
  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  decoded_token = jwt.decode(token,
                             env.JWT_SIGNING_SECRET,
                             algorithms=["HS256"])

  if decoded_token["user"]["role"] == "ADMIN" or decoded_token["user"][
      "role"] == "MANAGER":
    return jsonify(change_discount_amount(amount))

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/sales/<string:product_type>", methods=["GET"])
def get_sales_lastweek(product_type: str):
  """Function that retrieves the sales from the last 
    7 days for a given product type"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  decoded_token = jwt.decode(token,
                             env.JWT_SIGNING_SECRET,
                             algorithms=["HS256"])

  if decoded_token["user"]["role"] == "ADMIN" or decoded_token["user"][
      "role"] == "MANAGER":
    return jsonify(get_sales(product_type))

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/checkout-session", methods=["POST"])
def redirect_checkout():
  """It returns an url for checkout"""
  # Getting the required data through json
  payment_mode = "payment"
  products = request.get_json()
  user_id = 1
  for product in products:
    user_id = product["userId"]
    if product["type"] == "membership":
      payment_mode = "subscription"

  return make_a_purchase(user_id, products, payment_mode)


@app.route("/make-purchasable", methods=["POST"])
def create_purchasable():
  """Enables a product to be purchased"""
  #Getting the required data through json
  data = request.get_json()

  product_name = data["product_name"]
  product_price = data["product_price"]
  product_type = data["product_type"]

  make_purchasable(product_name, product_price, product_type)

  return jsonify({"message": "Product made purchasable."}), 200


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
    return make_response(jsonify({"Invalid Payload": str(payload_error)}), 400)

  except stripe_errors.SignatureVerificationError as signature_error:
    #Invalid Signature
    return make_response(jsonify({"Invalid Signature": str(signature_error)}),
                         400)

  #Checkout session completion
  if event.type == "checkout.session.completed":
    session = stripe.checkout.Session.retrieve(
        event.data.object.id,
        expand=["line_items"],
    )

    #Get invoice for checkout session
    invoice = stripe.Invoice.retrieve(session.invoice)

    #Determine transaction and expiry date
    transaction_time = str(datetime.now())
    expiry_time = str(datetime.now() + relativedelta(months=1))

    #Add purchase to database, inserting relavant fields for product type
    for purchased_item in session.line_items.data:
      product = stripe.Product.retrieve(purchased_item.price.product)

      price_object = stripe.Price.retrieve(purchased_item.price)

      # Charge to be processed at webhook
      charge_amount = price_object.unit_amount

      # Create a new charge for the product
      charge = stripe.Charge.create(
          amount=charge_amount,
          currency="gbp",
          customer=session.customer,
          description=purchased_item.price.product,
      )

      #If a product is a booking, complete pending bookings
      if get_product(product.name)[3] == "session":
        pending_bookings = get_pending(session.stripe_id)
        for booking in pending_bookings:
          requests.post("http://gateway/api/booking/bookings/book/",
                        json={
                            "userId": booking[0],
                            "eventId": booking[1],
                            "starts": booking[2]
                        },
                        timeout=5)

      #If item is a subscription, add an expiry date and update users
      if product.object == "subscription":

        user_id = get_user_from_stripe(session.customer)
        requests.post(f"http://gateway/api/users/{user_id}/updateMembership",
                      json={"membership": product.name},
                      timeout=5)

        add_purchase(session.customer, purchased_item.price.product,
                     transaction_time, charge.id, invoice.invoice_pdf,
                     expiry_time)
      else:
        add_purchase(session.customer, purchased_item.price.product,
                     transaction_time, charge.id, invoice.invoice_pdf)

    #remove pending booking transactions as purchase is complete
    delete_pending(session.stripe_id)

    return make_response("", 200)

  #Update subscription if invoice has been paid
  elif event.type == "invoice.paid":
    #Renews exipry of purchased subscription when paid
    invoice = event.data.object
    customer = invoice.customer

    #Check for subscription product and update expiry in database
    for item in invoice.lines.data:
      product = item.price.product
      if stripe.Product.retrieve(product).object == "subscription":
        expiry = 1
        #Update expiry to 12 months if yearly interval
        if item.price.recurring.interval == "year":
          expiry = 12
        update_expiry(customer, product,
                      str(datetime.now() + relativedelta(months=expiry)))

  #Cause subscription to expire if deleted
  elif event.type == "customer.subscription.deleted":
    subscription = event.data.object
    customer = subscription.customer
    product = subscription.items.data[1].price.product
    update_expiry(customer, product, str(datetime.now()))

  #Delete pending bookings if session expired
  elif event.type == "checkout.session.expired":
    session = stripe.checkout.Session.retrieve(
        event.data.object.id,
        expand=["line_items"],
    )
    delete_pending(session.stripe_id)
  return make_response("", 200)


@app.route("/purchased-products/<int:user_id>", methods=["GET"])
def get_purchased_products(user_id: int):
  """Retrieve all purchased products for a given user"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  decoded_token = jwt.decode(token,
                             env.JWT_SIGNING_SECRET,
                             algorithms=["HS256"])

  if decoded_token["user"]["role"] == "ADMIN" or decoded_token["user"][
      "role"] == "MANAGER":
    purchased_products = get_purchases(user_id)
    return jsonify(purchased_products)

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/customer-portal/<int:user_id>", methods=["GET"])
def customer_portal(user_id: int):
  """Generate a Stripe customer portal URL for the current user"""
  return redirect(get_payment_manager(user_id), code=303)


@app.route("/change-price", methods=["POST"])
def change_product_price():
  """End point for changing the price for managemnet uses"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  decoded_token = jwt.decode(token,
                             env.JWT_SIGNING_SECRET,
                             algorithms=["HS256"])

  if decoded_token["user"]["role"] == "ADMIN" or decoded_token["user"][
      "role"] == "MANAGER":
    # Getting the new price and product name
    data = request.get_json()

    new_price = data["new_price"]
    product_name = data["product_name"]

    # Calling the change_price function
    change_price(new_price, product_name)

    return jsonify({"message": "Price changed successfully"})

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/get-prices/<string:product_type>", methods=["GET"])
def get_prices(product_type: str):
  """Retrieve pricing list of specified product type"""
  return jsonify(get_pricing_lists(product_type))


@app.route("/cancel-membership/<int:user_id>", methods=["GET"])
def cancel_membership(user_id: int):
  """Cancels existing membership for the given user"""

  #Check if user exists
  if get_user(user_id) is None:
    return jsonify({"error": "User not found."}), 404
  return jsonify(cancel_subscription(user_id))


@app.route("/refund/<int:booking_id>", methods=["GET"])
def refund(booking_id):
  """Endpoint to process refunds for booking"""

  # Retrieve the purchase information from the database
  order = get_order(booking_id)

  # Checks if the purchase exists
  if not order:
    return jsonify({"error": "Purchase not found."}), 404

  # Refund the payment using Stripe API
  try:
    stripe.Refund.create(charge=order[5])

  except stripe_errors.StripeError as refund_error:
    return jsonify({"error": str(refund_error)}), 400

  # For now, delete order
  delete_order(order[0])

  return jsonify({"message": "Refund processed successfully."}), 200


@app.route("/receipt/<int:booking_id>", methods=["GET"])
def get_receipt(booking_id):
  """Endpoint to retrieve receipt PDF download link"""

  # Retrieve receipt link from the database
  purchase = get_order(booking_id)
  receipt = purchase[6]

  # Checks if the receipt exists
  if not receipt:
    return jsonify({"error": "Purchase not found."}), 404

  return jsonify({"receipt": receipt}), 200


@app.route("/health")
def get_health():
  """Gets the health of the microservice"""
  return {"status": "healthy" if check_health() else "degraded"}
