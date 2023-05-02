"""Modues provides functionality to make products purchasable or edit prices"""

import stripe
from stripe import error as stripe_errors
from stripe.error import StripeError
from datetime import datetime
import requests
import json
from flask import jsonify, make_response

from app.interfaces import create_portal
from app.database import (add_product, get_user, get_product, add_customer,
                          update_price, get_pricing_lists, get_purchases,
                          add_pending, add_purchase)


def make_purchasable(product_name: str, product_price: float,
                     product_type: str):
  """Make a chosen product purchasable through adding to stripe and DB"""

  try:
    #Adding product to stripe
    product = stripe.Product.create(
        name=product_name,
        default_price_data={
            "unit_amount_decimal": str(product_price * 100),
            "currency": "gbp"
        })

    #Adding product to database
    add_product(product_name, product.stripe_id, str(product_price),
                product_type)

    return 200, None

  except StripeError as e:
    return 500, str(e)


def make_a_purchase(user_id: int, products: list[dict], payment_mode: str,
                    bookings_count: int, auth: str, success_url: str,
                    cancel_url: str):
  """redirects user to stripe checkout for chosen subscription"""
  stripe_user = get_user(user_id)
  if stripe_user is None:

    new_customer = stripe.Customer.create()
    add_customer(user_id, new_customer.stripe_id)
    stripe_user = get_user(user_id)

  # Stores all the products that are about to be purchased
  line_items = []
  discount = []
  purchases = []

  payment_intent = {"setup_future_usage": "on_session"}

  # Checks user has purchased a subscription
  membership = False

  purchases = get_purchases(user_id)

  #Validate user has an unexpired membership for membership discount
  for purchase in purchases:
    if purchase[1] == "Membership":
      if datetime.now() < datetime.strptime(purchase[3],
                                            "%Y-%m-%d %H:%M:%S.%f"):
        membership = True

  for product in products:
    if product["type"] != "success" and product["type"] != "cancel":
      # Gets the product ID and price from the products table
      product_id = get_product(product["type"])[0]
      # Gets the product price from the products table
      product_price = stripe.Product.retrieve(product_id).default_price

      if product["type"] != "Membership-Monthly" and product[
          "type"] != "Membership-Yearly":
        bookings_count += 1

      if product["type"] == "Membership-Monthly" or product[
          "type"] == "Membership-Yearly":
        payment_intent = {}

      if bookings_count > 2:
        discount = [{"coupon": apply_discount()}]

      line_item = {"price": product_price, "quantity": 1}

      line_items.append(line_item)

      if membership and (product["type"] != "Membership-Monthly" and
                         product["type"] != "Membership-Yearly"):
        price = float(stripe.Price.retrieve(product_price).unit_amount) / 100

        try:
          response = requests.post("http://gateway/api/booking/bookings/book/",
                                   json={
                                       "user": product["data"]["user"],
                                       "event": product["data"]["event"],
                                       "starts": product["data"]["starts"]
                                   },
                                   timeout=5,
                                   headers={"Authorization": f"{auth}"})
          booked = json.loads(response.text)
          add_purchase(str(user_id), product_id, str(datetime.now()), "", price,
                       None, booked["booking"]["id"])
        # Case there was a request error
        except requests.exceptions.RequestException as request_error:

          # Return with appropiate status code
          return make_response(jsonify({"Invalid request": str(request_error)}),
                               400)

  if not membership:
    try:
      # Payment_intent_data should not be passed for a subscription:
      if payment_mode == "subscription":
        session = stripe.checkout.Session.create(
            customer=stripe_user[1],
            payment_method_types=["card"],
            line_items=line_items,
            mode=payment_mode,
            discounts=discount,
            success_url=success_url,
            cancel_url=cancel_url,
            expires_at=(int(datetime.timestamp(datetime.now())) + 1800))

      # If it is not a subscription:
      else:
        session = stripe.checkout.Session.create(
            customer=stripe_user[1],
            payment_method_types=["card"],
            line_items=line_items,
            mode=payment_mode,
            discounts=discount,
            success_url=success_url,
            cancel_url=cancel_url,
            payment_intent_data=payment_intent,
            invoice_creation={"enabled": True},
            expires_at=(int(datetime.timestamp(datetime.now())) + 1800))

      for product in products:
        if product["type"] != "success" and product["type"] != "cancel":
          add_pending(product["data"]["user"], product["data"]["event"],
                      product["data"]["starts"], auth, session.stripe_id,
                      product["type"])

      return jsonify({"Checkout": session.url})

    except StripeError as error:
      return jsonify({"error": {"message": str(error)}}), 400
      #Apply a discount if more than 2 bookings were made
  else:
    return jsonify({"Checkout": success_url})


def change_price(new_price: float, product_name: str):
  """Changes price of specified product for management microservice"""
  # Get the product
  product = get_product(product_name)
  if not product:
    return jsonify({"error": {"message": "Product not found."}}), 404

  recurring = None
  if product_name == "Membership-Yearly":
    recurring = {"interval": "year"}
  elif product_name == "Membership-Monthly":
    recurring = {"interval": "month"}

  # Getting the old and new price from stripe
  try:
    old_stripe_price = stripe.Product.retrieve(product[0]).default_price
    new_stripe_price = stripe.Price.create(unit_amount_decimal=int(new_price *
                                                                   100),
                                           currency="gbp",
                                           product=product[0],
                                           recurring=recurring)

    stripe.Product.modify(product[0], default_price=new_stripe_price.stripe_id)
    stripe.Price.modify(old_stripe_price, active=False)
  except StripeError as error:
    return jsonify({"error": {"message": str(error)}}), 400
  update_price(product_name, new_price)


def apply_discount():
  """Applies a discount to a product based on the discount condition"""

  # Apply the discount
  try:
    coupon = stripe.Coupon.retrieve("Multiple-Bookings")

  except stripe_errors.StripeError as error_coupon:
    return error_coupon

  # Round the discounted price to 2 decimal places
  return coupon.stripe_id


def change_discount_amount(amount: float):
  """
    Changes the discount amount set for 3
    or more bookings in a period of seven days
    """
  try:
    # Retrieve the current coupon
    coupon = stripe.Coupon.retrieve("Multiple-Bookings")

    # Delete the current coupon
    if coupon:
      stripe.Coupon.delete("Multiple-Bookings")

    # Create a new coupon with the same ID but the new percent amount
    stripe.Coupon.create(id="Multiple-Bookings",
                         percent_off=amount,
                         duration="forever",
                         applies_to={
                             "products": [
                                 "prod_NccVNTyzzYnn5Q", "prod_NcH2t0pyrS1Gje",
                                 "prod_NcGw30aHirjbtF"
                             ]
                         })

    return {"message": "Discount amount changed successfully"}, 200

  except StripeError as error:
    return {"error": {"message": str(error)}}, 500


def get_payment_manager(user_id: int):
  """Returns portal session for payments and subscription"""
  # Get the Stripe customer ID for the current user from the database
  if get_user(user_id) is None:
    new_customer = stripe.Customer.create()
    add_customer(user_id, new_customer.stripe_id)

  stripe_customer_id = get_user(user_id)[1]

  #Return portal for customer
  portal_session = create_portal(stripe_customer_id)
  return portal_session.url


def pricing_list(product_type: str):
  """Returns pricing list for the chosen product type"""
  price_list_array = get_pricing_lists(product_type)
  total = 0

  if not price_list_array:
    return {"quantity": 0, "prices_total": 0, "products": {}}

  for product in price_list_array:
    total += product["price"]

  return {
      "quantity": len(price_list_array),
      "prices_total": total,
      "products": {
          product["productName"]: product["price"]
          for product in price_list_array
      }
  }


def cancel_subscription(user_id: int):
  """Cancels membership for given user in Stripe"""
  stripe_user = get_user(user_id)[1]
  customer = stripe.Customer.retrieve(stripe_user, expand=["subscriptions"])
  subscription = f"{customer.subscriptions.data[0].id}"
  stripe.Subscription.delete(subscription)

  return 200


#Refund no longer implemented
#def refund_booking(booking_id: int):
#  """Refunds the booking to the user for the given booking id"""
# Retrieve the purchase information from the database
#  order = get_order(booking_id)

# Checks if the purchase exists
#  if not order:
#    return "Purchase not found"

# Refund the payment using Stripe API
#  try:
#    stripe.Refund.create(charge=order[5])

#  except stripe_errors.StripeError as refund_error:
#    return refund_error

# For now, delete order
#  delete_order(order[0])

#  return order
