import stripe
from interfaces import *
from database import *
from datetime import datetime

def MakePurchasable(productName, productPrice, productType="payment"):
    '''Make a chosen product purchasable through adding to stripe and DB'''

    #Adding product to stripe
    productStripe = stripe.Product.create(name=productName)
    price = stripe.Price.create(
        unit_amount_decimal=str(productPrice * 100),
        currency="gbp",
        product=productStripe.stripe_id
    )
    #Adding product to database
    addProduct(productName, price.stripe_id, productPrice, productType)

def MakeAPurchase(userID, productName):
    '''redirects user to stripe checkout for chosen product'''
    stripeUser = getUser(userID)

    if len(stripeUser[1]) == 0:
        newCustomer = stripe.Customer.create(
            #get user details from user microservice
        )
        addCustomer(userID, newCustomer.stripe_id)
        stripeUser = getUser(userID)
        
    # Gets the product ID from the products table 
    productID = getProduct(productName)[0]
    
    # Creates a new row in the purchased products table
    print(stripeUser[0])
    addPurchase(stripeUser[0], productID, datetime.now())

    return createCheckout(stripeUser[1], productName)