"""Modues provides functionality to make products purchasable or edit prices"""

import stripe
from stripe import error as stripe_errors
from datetime import datetime, timedelta
import requests

from app.interfaces import create_portal, LOCAL_DOMAIN
from app.database import (add_product, get_user, get_product, add_customer,
                          update_price, get_pricing_lists, get_purchases,
                          get_order, delete_order, add_pending)


def make_purchasable(product_name: str, product_price: float,
                     product_type: str):
  """Make a chosen product purchasable through adding to stripe and DB"""

  #Adding product to stripe
  product = stripe.Product.create(
      name=product_name,
      default_price_data={
          "unit_amount_decimal": str(product_price * 100),
          "currency": "gbp"
      })
  #stripe.Price.create(unit_amount_decimal=str(product_price * 100),
  #currency="gbp",
  #product=product.stripe_id)
  #Adding product to database
  add_product(product_name, product.stripe_id, str(product_price), product_type)


def make_a_purchase(user_id: int,
                    products: list[dict],
                    payment_mode: str,
                    test=False,
                    success_url=LOCAL_DOMAIN):
  """redirects user to stripe checkout for chosen subscription"""
  stripe_user = get_user(user_id)
  if stripe_user is None:

    stripe_user = get_user(user_id)
    new_customer = stripe.Customer.create(
        #get user details from user microservice
    )
    add_customer(user_id, new_customer.stripe_id)
    stripe_user = get_user(user_id)

  # Stores all the products that are about to be purchased
  line_items = []
  bookings_count = 0

  if not test:
    #The start date and end date used for filtering
    start_date = int(round(datetime.now().timestamp() * 1000))
    end_date = int(
        round((datetime.now() + timedelta(days=7)).timestamp() * 1000))

    bookings_array = (f"http://gateway/api/booking/bookings"
                      f"?user={user_id}"
                      f"&start={start_date}"
                      f"&end={end_date}")

    response = requests.get(bookings_array, timeout=10)

    # Count the number of bookings made for the
    # current customer in the last 7 days
    bookings_count = len(response.json())

  else:
    bookings_count = 6

  discount = []
  payment_intent = {"setup_future_usage": "on_session"}
  for product in products:
    # Gets the product ID and price from the products table
    product_id = get_product(product["type"])[0]

    if product["type"] == "booking":
      bookings_count += 1

    if get_product(product["type"])[3] == "membership":
      payment_intent = {}

    # Gets the product price from the products table
    product_price = stripe.Product.retrieve(product_id).default_price

    # Checks user has purchased a subscription
    membership = False
    purchases = get_purchases(user_id)

    #Validate user has an unexpired membership for membership discount
    for purchase in purchases:
      if purchase[1] == "membership" and datetime.now() < datetime.strptime(
          purchase[3], "%m/%d/%y %H:%M:%S"):
        membership = True

    #Apply a discount if more than 2 bookings were made
    if bookings_count > 2 or membership:
      discount = [{"coupon": apply_discount(membership)}]

    line_item = {"price": product_price, "quantity": 1}

    line_items.append(line_item)

  session = stripe.checkout.Session.create(customer=stripe_user[1],
                                           payment_method_types=["card"],
                                           line_items=line_items,
                                           mode=payment_mode,
                                           discounts=discount,
                                           success_url=success_url,
                                           cancel_url=success_url,
                                           payment_intent_data=payment_intent)

  for product in products:
    if product["type"] == "booking":
      add_pending(product["data"]["userId"], product["data"]["eventId"],
                  product["data"]["starts"], session.stripe_id)

  return session.url


def change_price(new_price: str, product_name: str):
  """Changes price of specified product for management microservice"""
  product = get_product(product_name)

  old_stripe_price = stripe.Product.retrieve(product[0]).default_price
  new_stripe_price = stripe.Price.create(unit_amount_decimal=str(new_price *
                                                                 100),
                                         currency="gbp",
                                         product=product[0])

  stripe.Product.modify(product[0], default_price=new_stripe_price.stripe_id)
  stripe.Price.modify(old_stripe_price, active=False)
  update_price(product_name, new_price)


def apply_discount(membership: bool):
  """Applies a discount to a product based on the discount condition"""

  # Apply the discount
  try:
    coupon = stripe.Coupon.retrieve("VOz7neAM")
    if membership:
      coupon = stripe.Coupon.retrieve("L1rD3SEB")

  except stripe_errors.StripeError as error_coupon:
    return error_coupon

  # Round the discounted price to 2 decimal places
  return coupon


def change_discount_amount(amount: float):
  """
    Changes the discount amount set for 3
    or more bookings in a period of seven days
    """
  stripe.Coupon.modify(
      "VOz7neAM",
      metadata={"percent_off": amount},
  )

  return 200


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

  #FOR NOW - Temporarirly removing microservice dependencies
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
