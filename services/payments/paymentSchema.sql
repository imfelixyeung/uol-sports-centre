DROP TABLE IF EXISTS products;

CREATE TABLE products (
    productID TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    productType TEXT
    CHECK( productType IN ('facility', 'activity', 'session', 'subscription')) NOT NULL
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    orderID INTEGER PRIMARY KEY,
    userID INTEGER NOT NULL,
    productID TEXT NOT NULL,
    purchaseDate TEXT NOT NULL,
    expiryDate TEXT,
    chargeID TEXT NOT NULL, 
    FOREIGN KEY (productID) REFERENCES products(productID)
);

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    userID INTEGER NOT NULL, 
    stripeID TEXT NOT NULL,
    FOREIGN KEY (userID) REFERENCES orders(userID),
    PRIMARY KEY (userID, stripeID)
)