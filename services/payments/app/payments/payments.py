"""Modues provides functionality to make products purchasable or edit prices"""

from datetime import datetime
import stripe
#import requests

from app.interfaces import create_portal, LOCAL_DOMAIN
from app.database import (add_product, get_user, get_product, add_customer,
                          add_purchase, update_price)


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

    if len(stripe_user[1]) == 0:
        new_customer = stripe.Customer.create(
            #get user details from user microservice
        )
        add_customer(user_id, new_customer.stripe_id)
        stripe_user = get_user(user_id)

    line_items = []

    #api_url = "http://gateway/api/booking/bookings?user={userid}&start={start_date}&end={end_date}"

    #response = requests.get(api_url)

    for product in products:
        # Gets the product ID and price from the products table
        product_id = get_product(product)[0]

        line_item = {
            "price": stripe.Product.retrieve(product_id).default_price,
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


def apply_discount(product_name):
    '''Applies a discount to a product based on the discount condition'''

    # Get the original price of the product
    product_price = get_product(product_name)[2]

    # Apply the discount
    try:
        coupon = stripe.Coupon.retrieve("VOz7neAM")

        if coupon.valid:
            product_price = product_price * (1 - coupon.percent_off / 100)

    except stripe.error.StripeError as error_coupon:
        return error_coupon

    # Round the discounted price to 2 decimal places
    return round(product_price, 2)


def change_discount_amount(amount: float):
    """Chanes the discount amount set for 3 or more bookings in a period of seven days"""
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
