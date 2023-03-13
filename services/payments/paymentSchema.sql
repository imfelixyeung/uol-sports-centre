DROP TABLE IF EXISTS products;

CREATE TABLE products (
    priceID TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    productType TEXT NOT NULL
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    orderID INTEGER PRIMARY KEY,
    userID TEXT NOT NULL,
    priceID TEXT NOT NULL,
    purchaseDate TEXT NOT NULL, 
    FOREIGN KEY (priceID) REFERENCES products(priceID)
);

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    userID INTEGER NOT NULL, 
    stripeID TEXT NOT NULL,
    FOREIGN KEY (userID) REFERENCES orders(userID),
    PRIMARY KEY (userID, stripeID)
)