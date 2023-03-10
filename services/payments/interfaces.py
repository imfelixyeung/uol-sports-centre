import stripe
import os
from database import *
from datetime import datetime

localDomain = 'http://localhost:' + os.getenv('APP_PORT')

def createCheckout(stripeID, productName):
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''
    product = getProduct(productName)

    if not product:
        # handle the case where no product was found
        return None

    checkoutSession = stripe.checkout.Session.create(
        success_url=localDomain + '/index.html',
        mode = product[3],
        expires_at=int(datetime.timestamp(datetime.now())) + 1800,
        customer=stripeID,
        line_items=[
        {
            "price": product[0],
            "quantity": 1
        },],
    )
    return checkoutSession.url

def createPortal(userID):
    # Get the Stripe customer ID for the current user from the database
    stripe_customer_id = getUser(userID)[1]

    # Generate a Stripe customer portal URL for the current user
    customer_portal_session = stripe.billing_portal.Session.create(
        customer=stripe_customer_id,
        return_url=localDomain + '/index.html'
    )
    return customer_portal_session
