    #tests if it can make a test product purchasable
        payments.MakePurchasable('product-test', 5.0, 'test-type', 500)

        #retrieving the added product from Stripe
        productStrpie = stripe.Product.list(limit=1, name='product-test').data[0]
        price = stripe.Price.list(limit=1, product=productStripe.id).data[0]

        #asserting that the added product matches the expected result
        self.assertEqual(productStrpie.name, 'test-product')
        self.assertEqual(price.unit_amount_decimal, '500')

