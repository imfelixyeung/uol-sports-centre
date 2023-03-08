DROP TABLE IF EXISTS products;

CREATE TABLE products (
    priceID TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    productID TEXT NOT NULL,
    price TEXT NOT NULL,
    productType TEXT NOT NULL
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    userID INTEGER NOT NULL,
    productID TEXT NOT NULL,
    priceID TEXT NOT NULL,
    purchaseDate TEXT NOT NULL, 
    FOREIGN KEY (priceID) REFERENCES products(priceID),
    FOREIGN KEY (productID) REFERENCES products(productID),
    PRIMARY KEY (userID, productID)
);

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    userID INTEGER NOT NULL, 
    stripeID TEXT NOT NULL,
    FOREIGN KEY (userID) REFERENCES orders(userID),
    PRIMARY KEY (userID, stripeID)
)