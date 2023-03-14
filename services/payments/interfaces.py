import stripe
import os
from dotenv import load_dotenv
from database import *
from datetime import datetime

# Get absolute path of directory where .env is 
dirtoenv = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(dirtoenv, '.env'))

localDomain = 'http://localhost:' + str(os.getenv('APP_PORT'))

def createCheckout(stripeID, productName, successUrl=localDomain):
    '''Create checkout session for purchasing bookings/subscriptions using Stripe'''
    product = getProduct(productName)

    if not product:
        # handle the case where no product was found
        return None

    checkoutSession = stripe.checkout.Session.create(
        success_url=successUrl,
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

def createPortal(stripeID, returnUrl=localDomain):

    # Generate a Stripe customer portal for the current user
    customer_portal_session = stripe.billing_portal.Session.create(
        customer=stripeID,
        return_url=returnUrl
    )
    return customer_portal_session
