"""Module that presents interface to the payment microservice"""
from datetime import datetime

from app.database import get_product

import stripe
import env as env

LOCAL_DOMAIN = f"http://localhost:{env.APP_PORT}"


def create_checkout(stripe_id: str,
                    product_name: str,
                    success_url=LOCAL_DOMAIN):
    "Create checkout session for purchasing bookings/subscriptions using Stripe"
    product = get_product(product_name)

    if not product:
        # handle the case where no product was found
        return None

    checkout_session = stripe.checkout.Session.create(
        success_url=success_url,
        mode=product[3],
        expires_at=int(datetime.timestamp(datetime.now())) + 1800,
        customer=stripe_id,
        line_items=[
            {
                "price": stripe.Product.retrieve(product[0]).default_price,
                "quantity": 1
            },
        ],
    )
    return checkout_session.url


def create_portal(stripe_id: str, return_url=LOCAL_DOMAIN):
    """Generate a Stripe customer portal for the given user"""
    customer_portal_session = stripe.billing_portal.Session.create(
        customer=stripe_id, return_url=return_url)
    return customer_portal_session
