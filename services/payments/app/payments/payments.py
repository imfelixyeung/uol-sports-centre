"""Modues provides functionality to make products purchasable or edit prices"""

import stripe
from stripe import error as stripe_errors
from datetime import datetime, timedelta
import requests

from app.interfaces import create_portal, LOCAL_DOMAIN
from app.database import (add_product, get_user, get_product, add_customer,
                          update_price, get_pricing_lists, get_purchases,
                          get_order, delete_order)


def make_purchasable(product_name: str,
                     product_price: float,
                     product_type: str,
                     booking_id=""):
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
  add_product(product_name, product.stripe_id, str(product_price), booking_id,
              product_type)


#def send_receipt(user_id: int, session_id: str):
# """Sends a receipt to the given user for the given session"""
#stripe_user = get_user(user_id)

# Get the payment intent ID from the stripe session
#session = stripe.checkout.Session.retrieve(session_id)
#payment_intent_id = session.payment_intent
#The following is commented out for now in order to not return any errors
# Get the customer email through endpoint call
# response = requests.get(f"http://gateway/api/auth/{user_id}", timeout=5)

# data = response.json()
# email_address = data["data"]["email"]

# # Send the receipt email to customer
# stripe.PaymentIntent.confirm(
#     payment_intent_id,
#     receipt_email=email_address,
# )


#Returns the pdf download link for a receipt, given the order ID
def get_receipt(order_id: int):
  """Get receipt for pdf download"""
  purchase = get_purchases(order_id)
  return purchase[5]


def make_a_purchase(user_id: int,
                    products: list[str],
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

  update_subscription = False
  discount = []

  for product in products:
    # Gets the product ID and price from the products table
    product_id = get_product(product)[0]
    product_name = get_product(product)[1]
    product_type = get_product(product)[3]

    if product_type == "session":
      bookings_count += 1

    if product_type == "subscription":
      update_subscription = True

    # Gets the product price from the products table
    product_price = stripe.Product.retrieve(product_id).default_price

    # Checks user has purchased a subscription
    membership = False
    purchases = get_purchases(user_id)

    for purchase in purchases:
      if purchase[2] == "subscription":
        # and datetime.now() < time.strptime(purchase[4]):
        membership = True

    #Apply a discount if more than 2 bookings were made
    if bookings_count > 2 or membership:
      discount = [{"coupon": apply_discount(membership)}]

    line_item = {"price": product_price, "quantity": 1}

    line_items.append(line_item)

    # Creates a new row in the purchased products table
    #add_purchase(stripe_user[0], product_id, str(datetime.now()), charge.id)

    if update_subscription is True and not test:

      #FOR NOW - Temporarirly removing microservice dependencies
      response_users = requests.post(
          f"http://gateway/api/users/{user_id}/updateMembership",
          json={"membership": product_name},
          timeout=5)

      if response_users.status_code != 200:
        return {"error": "failed to recieve response from users"}

      update_subscription = False

  session = stripe.checkout.Session.create(
      customer=stripe_user[1],
      payment_method_types=["card"],
      line_items=line_items,
      mode=payment_mode,
      discounts=discount,
      success_url=success_url,
      cancel_url=success_url,
  )

  # send_receipt(user_id, session.id)

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

  # Get the original price of the product
  #product_price = get_product(product_name)[2]

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

  return "SUCCESSS"


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


def refund_booking(booking_id: str):
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
