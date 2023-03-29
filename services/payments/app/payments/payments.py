"""Modues provides functionality to make products purchasable or edit prices"""

import stripe
from stripe import error as stripe_errors
from typing import Optional
from stripe.error import StripeError
from datetime import datetime
import requests
from flask import jsonify

from app.interfaces import create_portal, LOCAL_DOMAIN
from app.database import (add_product, get_user, get_product, add_customer,
                          update_price, get_pricing_lists, get_purchases,
                          get_order, delete_order, add_pending, add_purchase)


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


def make_a_purchase(user_id: int,
                    products: list[dict],
                    payment_mode: str,
                    bookings_count: int,
                    success_url: Optional[str] = LOCAL_DOMAIN):
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
    if purchase[1] == "membership":
      if datetime.now() < datetime.strptime(purchase[3],
                                            "%Y-%m-%d %H:%M:%S.%f"):
        membership = True

  for product in products:
    # Gets the product ID and price from the products table
    product_id = get_product(product["type"])[0]

    if product["type"] != "membership":
      bookings_count += 1

    if get_product(product["type"])[3] == "membership":
      payment_intent = {}

    # Gets the product price from the products table
    product_price = stripe.Product.retrieve(product_id).default_price

    if bookings_count > 2:
      discount = [{"coupon": apply_discount()}]

    line_item = {"price": product_price, "quantity": 1}

    line_items.append(line_item)

    if membership:
      add_purchase(str(user_id), product_id, str(datetime.now()), "", "")

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
            cancel_url=success_url,
        )

      # If it is not a subscription:
      else:
        session = stripe.checkout.Session.create(
            customer=stripe_user[1],
            payment_method_types=["card"],
            line_items=line_items,
            mode=payment_mode,
            discounts=discount,
            success_url=success_url,
            cancel_url=success_url,
            payment_intent_data=payment_intent,
            invoice_creation={"enabled": True},
        )

      for product in products:
        if product["type"] != "membership":
          add_pending(product["data"]["userId"], product["data"]["eventId"],
                      product["data"]["starts"], session.stripe_id)

      return jsonify({"Checkout": session.url})

    except StripeError as error:
      return jsonify({"error": {"message": str(error)}}), 400
      #Apply a discount if more than 2 bookings were made
  else:
    return jsonify({"Checkout": success_url})


def change_price(new_price: str, product_name: str):
  """Changes price of specified product for management microservice"""
  # Get the product
  product = get_product(product_name)
  if not product:
    return jsonify({"error": {"message": "Product not found."}}), 404

  # Getting the old and new price from stripe
  try:
    old_stripe_price = stripe.Product.retrieve(product[0]).default_price
    new_stripe_price = stripe.Price.create(unit_amount_decimal=str(new_price *
                                                                   100),
                                           currency="gbp",
                                           product=product[0])

    stripe.Product.modify(product[0], default_price=new_stripe_price.stripe_id)
    stripe.Price.modify(old_stripe_price, active=False)
  except StripeError as error:
    return jsonify({"error": {"message": str(error)}}), 400

  update_price(product_name, new_price)


def apply_discount():
  """Applies a discount to a product based on the discount condition"""

  # Apply the discount
  try:
    coupon = stripe.Coupon.retrieve("VOz7neAM")

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
    coupon = stripe.Coupon.retrieve("VOz7neAM")
    coupon.percent_off = amount
    coupon.save()

    return {"message": "Discount amount changed successfully"}, 200

  except StripeError as error:
    return {"error": {"message": str(error)}}, 500


def get_payment_manager(user_id: int):
  """Returns portal session for payments and subscription"""
  # Get the Stripe customer ID for the current user from the database
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
  customer = stripe.Customer.retrieve(stripe_user)
  subscription = f"{customer.subscriptions.data[0].id}"
  stripe.Subscription.delete(subscription)

  # Updating the membership status in the user microservice
  response_users = requests.post(
      f"http://gateway/api/users/{user_id}/updateMembership",
      json={"membership": subscription},
      timeout=5)

  return response_users.status_code


def refund_booking(booking_id: int):
  """Refunds the booking to the user for the given booking id"""
  # Retrieve the purchase information from the database
  order = get_order(booking_id)

  # Checks if the purchase exists
  if not order:
    return "Purchase not found"

  # Refund the payment using Stripe API
  try:
    stripe.Refund.create(charge=order[5])

  except stripe_errors.StripeError as refund_error:
    return refund_error

  # For now, delete order
  delete_order(order[0])

  return order
