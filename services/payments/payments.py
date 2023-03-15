"""Modues provides functionality to make products purchasable or edit prices"""

from datetime import datetime
import stripe
from flask import redirect

from interfaces import create_portal
from interfaces import LOCAL_DOMAIN

from database import add_product
from database import get_user
from database import get_product
from database import add_customer
from database import add_purchase
from database import update_price


def make_purchasable(product_name, product_price, product_type="payment"):
    '''Make a chosen product purchasable through adding to stripe and DB'''

    #Adding product to stripe
    product = stripe.Product.create(name=product_name)
    stripe.Price.create(unit_amount_decimal=str(product_price * 100),
                        currency="gbp",
                        product=product.stripe_id)
    #Adding product to database
    add_product(product_name, product.stripe_id, product_price, product_type)


def make_a_purchase(user_id, products, payment_mode, success_url=LOCAL_DOMAIN):
    '''redirects user to stripe checkout for chosen subscription'''
    stripe_user = get_user(user_id)

    if len(stripe_user[1]) == 0:
        new_customer = stripe.Customer.create(
            #get user details from user microservice
        )
        add_customer(user_id, new_customer.stripe_id)
        stripe_user = get_user(user_id)

    line_items = []

    for product in products:
        # Gets the product ID and price from the products table
        product_id = get_product(product)[0]
        #price = get_product(product)[2]

        line_item = {
            "price": stripe.Product.retrieve(product_id).default_price,
            "quantity": 1,
        }
        line_items.append(line_item)

        # Creates a new row in the purchased products table
        add_purchase(stripe_user[0], product_id, datetime.now())

    session = stripe.checkout.Session.create(
        customer=stripe_user[1],
        payment_method_types=["card"],
        line_items=line_items,
        mode=payment_mode,
        success_url=success_url,
        cancel_url=success_url,
    )

    return redirect(session.url, code=303)


def change_price(new_price, product_name):
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


def get_payment_manager(user_id):
    '''Returns portal session for payments and subscription'''
    # Get the Stripe customer ID for the current user from the database
    stripe_customer_id = get_user(user_id)[1]

    #Return portal for customer
    portal_session = create_portal(stripe_customer_id)
    return portal_session.url
