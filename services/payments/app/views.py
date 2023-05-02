"""Payments Microservice:
Provides functionality for making payments for products"""
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import requests
import jwt
import stripe
from stripe import error as stripe_errors
from flask import request, jsonify, make_response

from app import app
from app.database import (check_health, get_purchases, add_purchase,
                          update_expiry, get_sales, get_pricing_lists,
                          get_order, get_user, get_user_from_stripe,
                          get_product, get_pending, delete_pending, add_product,
                          init_database, check_pending)
from app.payments import (make_a_purchase, get_payment_manager, change_price,
                          change_discount_amount, cancel_subscription,
                          make_purchasable)
from app.interfaces import LOCAL_DOMAIN

import env
import json

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

  if decoded_token["user"]["role"] == "ADMIN":
    return change_discount_amount(amount)

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

  if decoded_token["user"]["role"] == "ADMIN":
    return jsonify(get_sales(product_type))

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/checkout-session", methods=["POST"])
def redirect_checkout():
  """It returns an url for checkout"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)
  success_url = LOCAL_DOMAIN
  cancel_url = LOCAL_DOMAIN

  payment_mode = "payment"
  products = request.get_json()
  user_id = 1

  for product in products:
    if product["type"] != "success" and product["type"] != "cancel":
      if product["type"] != "Membership-Monthly" and product[
          "type"] != "Membership-Yearly":
        session = check_pending(product["data"]["user"],
                                product["data"]["event"],
                                product["data"]["starts"], auth)
        if session != "not_found":
          checkout = stripe.checkout.Session.retrieve(session[0])
          return {"Checkout": checkout.url}
      user_id = product["data"]["user"]
      if product["type"] == "Membership-Yearly" or product[
          "type"] == "Membership-Monthly":
        payment_mode = "subscription"
    if product["type"] == "success":
      success_url = product["data"]["url"]
    if product["type"] == "cancel":
      cancel_url = product["data"]["url"]

  #The start date and end date used for filtering
  start_date = int(round(datetime.now().timestamp() * 1000))
  end_date = int(round((datetime.now() + timedelta(days=7)).timestamp() * 1000))

  bookings_array = (f"http://gateway/api/booking/bookings"
                    f"?user={user_id}"
                    f"&start={start_date}"
                    f"&end={end_date}")

  try:
    response = requests.get(bookings_array,
                            timeout=10,
                            headers={"Authorization": f"{auth}"})

  except requests.exceptions.Timeout:
    return jsonify({"error": "The request timed out"}), 504

  except requests.exceptions.RequestException as e:
    return jsonify(
        {"error": "An error occurred while making the request: " + str(e)}), 500

  # Count the number of bookings made for the
  # current customer in the last 7 days
  bookings_count = len(response.json()["bookings"])

  return make_a_purchase(user_id, products, payment_mode, bookings_count, auth,
                         success_url, cancel_url)


@app.route("/make-purchasable", methods=["POST"])
def create_purchasable():
  """Enables a product to be purchased"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Getting the required data through json
  data = request.get_json()

  # If there are missing data, return the error accordingly
  if not all(
      key in data for key in ["product_name", "product_price", "product_type"]):
    return jsonify({"message": "Missing required data"}), 400

  product_name = data["product_name"]
  product_price = data["product_price"]
  product_type = data["product_type"]

  status_code, message = make_purchasable(product_name, product_price,
                                          product_type)

  if status_code == 200:
    return jsonify({"message": "Product made purchasable."}), 200

  else:
    return jsonify({"message": message}), 500


@app.route("/webhook", methods=["POST"])
def webhook_received():
  """Provisions purchased product to user, after successful payment"""
  event = None
  signature = request.headers.get("stripe-signature")

  if not signature:
    return jsonify({"message": "signature missing"}), 401

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
                         401)

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
    pending = get_pending(session.stripe_id)
    booked_ids = []
    for booking in pending:
      if booking[6] != "Membership-Monthly" and booking[
          6] != "Membership-Yearly":
        try:
          response = requests.post(
              "http://gateway/api/booking/bookings/book/",
              json={
                  "user": booking[1],
                  "event": booking[2],
                  "starts": booking[3]
              },
              timeout=5,
              headers={"Authorization": f"{pending[0][5]}"})
          booked = json.loads(response.text)
          booked_ids.append(booked["booking"]["id"])
        # Case there was a request error
        except requests.exceptions.RequestException as request_error:

          # Return with appropiate status code
          return make_response(jsonify({"Invalid request": str(request_error)}),
                               400)

    # Iterate through the retrieved line items
    booking_index = 0
    for purchased_item in session.list_line_items(limit=100).data:
      product = stripe.Product.retrieve(purchased_item.price.product)
      price = float(purchased_item.price.unit_amount) / 100

      #If item is a subscription, add an expiry date and update users
      user_id = get_user_from_stripe(session.customer)
      if get_product(product.name)[3] == "Membership":

        try:
          requests.put(f"http://gateway/api/users/{user_id}/updateMembership",
                       json={"membership": product.name},
                       timeout=5,
                       headers={"Authorization": f"{pending[0][5]}"})

        # Case there was a request error
        except requests.exceptions.RequestException as request_error:
          # Return with appropiate status code
          return make_response(jsonify({"Invalid request": str(request_error)}),
                               400)

        add_purchase(user_id, purchased_item.price.product, transaction_time,
                     invoice.invoice_pdf, price, expiry_time)
      else:
        add_purchase(user_id, purchased_item.price.product, transaction_time,
                     invoice.invoice_pdf, price, None,
                     booked_ids[booking_index])
        booking_index = booking_index + 1

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
    return jsonify({"message": "Missing authorization header"}, 400)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  try:
    decoded_token = jwt.decode(token,
                               env.JWT_SIGNING_SECRET,
                               algorithms=["HS256"])

  except jwt.exceptions.DecodeError:
    return jsonify({"message": "Invalid token."}, 401)

  allowed_roles = ["USER", "ADMIN", "EMPLOYEE"]
  if decoded_token["user"]["role"] in allowed_roles:
    purchased_products = get_purchases(user_id)
    return jsonify(purchased_products)

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/customer-portal/<int:user_id>", methods=["GET"])
def customer_portal(user_id: int):
  """Generate a Stripe customer portal URL for the current user"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 400)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  try:
    decoded_token = jwt.decode(token,
                               env.JWT_SIGNING_SECRET,
                               algorithms=["HS256"])

  except jwt.exceptions.DecodeError:
    return jsonify({"message": "Invalid token."}, 401)

  allowed_roles = ["USER", "ADMIN", "EMPLOYEE"]
  if decoded_token["user"]["role"] in allowed_roles:
    received_url = get_payment_manager(user_id)

    if received_url:
      return jsonify({"Portal": received_url})
    else:
      return jsonify({"error": "Could not generate customer portal URL."}), 404

  else:
    return make_response(jsonify({"message": "access denied"}), 403)


@app.route("/change-price", methods=["POST"])
def change_product_price():
  """End point for changing the price for managemnet uses"""

  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  try:
    decoded_token = jwt.decode(token,
                               env.JWT_SIGNING_SECRET,
                               algorithms=["HS256"])

  except jwt.exceptions.DecodeError:
    return jsonify({"message": "Invalid token."}, 400)

  if decoded_token["user"]["role"] == "ADMIN":
    # Getting the new price and product name
    data = request.get_json()

    if not all(key in data for key in ["product_name", "new_price"]):
      return jsonify({"message": "Missing required data"}), 400

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

  received_list = get_pricing_lists(product_type)

  if received_list:
    return jsonify(received_list), 200
  else:
    return jsonify({"error": "No prices found."}), 404


@app.route("/cancel-membership/<int:user_id>", methods=["GET"])
def cancel_membership(user_id: int):
  """Cancels existing membership for the given user"""
  auth = request.headers.get("Authorization")

  if auth is None:
    return jsonify({"message": "Missing authorization header"}, 401)

  # Extract the token from the "Authorization" header
  token = auth.split()[1]

  # Decode the token using the algorithm and secret key
  decoded_token = jwt.decode(token,
                             env.JWT_SIGNING_SECRET,
                             algorithms=["HS256"])

  allowed_roles = ["USER", "ADMIN", "EMPLOYEE"]
  if decoded_token["user"]["role"] in allowed_roles:
    #Check if user exists
    if get_user(user_id) is None:
      return jsonify({"error": "User not found."}), 404
    #Updating the membership status in the user microservice
    requests.put(f"http://gateway/api/users/{user_id}/updateMembership",
                 json={"membership": ""},
                 timeout=5,
                 headers={"Authorization": f"{auth}"})
    cancel_subscription(user_id)
    return make_response(jsonify({"message": "success"}), 200)
  else:
    return make_response(jsonify({"message": "access denied"}), 403)


#Refund no longer implemented
#@app.route("/refund/<int:booking_id>", methods=["GET"])
#def refund(booking_id):
#  """Endpoint to process refunds for booking"""

# Retrieve the purchase information from the database
#  order = get_order(booking_id)

# Checks if the purchase exists
#  if not order:
#    return jsonify({"error": "Purchase not found."}), 404

# Refund the payment using Stripe API
#  try:
#    stripe.Refund.create(charge=order[5])

#  except stripe_errors.StripeError as refund_error:
#    return jsonify({"error": str(refund_error)}), 400

#  return jsonify({"message": "Refund processed successfully."}), 200


@app.route("/receipt/<int:booking_id>", methods=["GET"])
def get_receipt(booking_id):
  """Endpoint to retrieve receipt PDF download link"""

  # Retrieve receipt link from the database
  purchase = get_order(booking_id)

  # Check if purchase is None or empty
  if not purchase:
    return jsonify({"error": "Purchase not found."}), 404

  # Check if receipt exists
  if len(purchase) < 7 or not purchase[5]:
    return jsonify({
        "error": """Receipt not found for this purchase (User may be member)."""
    }), 404

  receipt = purchase[5]

  # Checks if the receipt exists
  if not receipt:
    return jsonify({"error": "Purchase not found."}), 404

  return jsonify({"receipt": receipt}), 200


def init_payments():
  """Endpoint to initialise the database for products"""
  init_database()
  products = stripe.Product.list(limit=100)

  for product in products:
    name = product.name

    if name == "Session":
      price = stripe.Price.retrieve(product.default_price)
      add_product(name, product.id, str(float(price.unit_amount) / 100),
                  "Session")
    elif name == "Activity":
      price = stripe.Price.retrieve(product.default_price)
      add_product(name, product.id, str(float(price.unit_amount) / 100),
                  "Activity")
    elif name == "Facility":
      price = stripe.Price.retrieve(product.default_price)
      add_product(name, product.id, str(float(price.unit_amount) / 100),
                  "Facility")
    elif name == "Membership-Monthly":
      price = stripe.Price.retrieve(product.default_price)
      add_product(name, product.id, str(float(price.unit_amount) / 100),
                  "Membership")
    elif name == "Membership-Yearly":
      price = stripe.Price.retrieve(product.default_price)
      add_product(name, product.id, str(float(price.unit_amount) / 100),
                  "Membership")


@app.route("/health")
def get_health():
  """Gets the health of the microservice"""
  return {"status": "healthy" if check_health() else "degraded"}


init_payments()
