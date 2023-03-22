"""Modues provides functionality to make products purchasable or edit prices"""

from datetime import datetime, timedelta, time
import stripe
import requests

from app.interfaces import create_portal, LOCAL_DOMAIN
from app.database import (add_product, get_user, get_product, add_customer,
                          add_purchase, update_price, get_pricing_lists,
                          get_purchases, update_expiry)


def make_purchasable(product_name: str,
                     product_price: str,
                     product_type="payment"):
    '''Make a chosen product purchasable through adding to stripe and DB'''

    #Adding product to stripe
    product = stripe.Product.create(name=product_name)
    stripe.Price.create(unit_amount_decimal=str(product_price * 100),
                        currency="gbp",
                        product=product.stripe_id)
    #Adding product to database
    add_product(product_name, product.stripe_id, product_price, product_type)


def make_a_purchase(user_id: int,
                    products: list[str],
                    payment_mode: str,
                    success_url=LOCAL_DOMAIN):
    '''redirects user to stripe checkout for chosen subscription'''
    stripe_user = get_user(user_id)

    if stripe_user[1] == 0:
        new_customer = stripe.Customer.create(
            #get user details from user microservice
        )
        add_customer(user_id, new_customer.stripe_id)
        stripe_user = get_user(user_id)

    # Stores all the products that are about to be purchased
    line_items = []

    # The start date and end date to check if three or more bookings were made for this customer
    start_date = int(round(datetime.now().timestamp() * 1000))
    end_date = int(
        round((datetime.now() + timedelta(days=7)).timestamp() * 1000))

    bookings_array = (f"http://gateway/api/booking/bookings"
                      f"?user={user_id}"
                      f"&start={start_date}"
                      f"&end={end_date}")

    response = requests.get(bookings_array, timeout=10)

    # Count the number of bookings made for the current customer in the last 7 days
    bookings_count = len(response.json())

    for product in products:
        # Gets the product ID and price from the products table
        product_id = get_product(product)[0]
        product_name = get_product(product)[1]
        product_type = get_product(product)[3]

        if product_type == "session":
            bookings_count += 1

        # Gets the product price from the products table
        product_price = stripe.Product.retrieve(product_id).default_price

        #Checks user has purchased a subscription
        membership = False
        purchases = get_purchases(user_id)
        for purchase in purchases:
            if purchase[2] == 'subscription':
                membership = True

        # Apply a discount if there have been more than 2 bookings for the current customer
        # if bookings_count > 2 or membership:
        #     product_price = apply_discount(product_name, membership)

        line_item = {
            "price": product_price,
            "quantity": 1,
        }
        line_items.append(line_item)

        # Creates a new row in the purchased products table
        add_purchase(stripe_user[0], product_id, str(datetime.now()))

    session = stripe.checkout.Session.create(
        customer=stripe_user[1],
        payment_method_types=["card"],
        line_items=line_items,
        mode=payment_mode,
        success_url=success_url,
        cancel_url=success_url,
    )

    return session.url


def change_price(new_price: str, product_name: str):
    '''Changes price of specified product for management microservice'''
    product = get_product(product_name)

    old_stripe_price = stripe.Product.retrieve(product[0]).default_price
    new_stripe_price = stripe.Price.create(unit_amount_decimal=str(new_price *
                                                                   100),
                                           currency="gbp",
                                           product=product[0])

    stripe.Product.modify(product[0], default_price=new_stripe_price.stripe_id)
    stripe.Price.modify(old_stripe_price, active=False)
    update_price(product_name, new_price)


def apply_discount(product_name: str, membership: bool):
    '''Applies a discount to a product based on the discount condition'''

    # Get the original price of the product
    product_price = get_product(product_name)[2]

    # Apply the discount
    try:
        coupon = stripe.Coupon.retrieve("VOz7neAM")
        if membership:
            coupon = stripe.Coupon.retrieve("L1rD3SEB")

        if coupon.valid:
            product_price = float(product_price) * (1 -
                                                    coupon.percent_off / 100)

    except stripe.error.StripeError as error_coupon:
        return error_coupon

    # Round the discounted price to 2 decimal places
    return round(product_price, 2)


def change_discount_amount(amount: float):
    """Changes the discount amount set for 3 or more bookings in a period of seven days"""
    stripe.Coupon.modify(
        "VOz7neAM",
        metadata={"percent_off": amount},
    )


def get_payment_manager(user_id: int):
    '''Returns portal session for payments and subscription'''
    # Get the Stripe customer ID for the current user from the database
    stripe_customer_id = get_user(user_id)[1]

    #Return portal for customer
    portal_session = create_portal(stripe_customer_id)
    return portal_session.url


def pricing_list(product_type: str):
    """Returns pricing list for the chosen product type"""
    pricing_list = get_pricing_lists(product_type)
    total = 0
    for product in pricing_list:
        total += product[1]
    return {
        'quantity': len(pricing_list),
        'prices_total': total,
        'products': {product[0]: product[1] for product in pricing_list}
    }


def cancel_subscription(user_id: int):
    """Cancels membership for given user in Stripe"""
    stripe_user = get_user(user_id)[1]
    customer = stripe.Customer.retrieve(stripe_user)
    subscription = customer.subscriptions.data[0].id
    stripe.Subscription.delete(subscription)
