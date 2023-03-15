DROP TABLE IF EXISTS products;

CREATE TABLE products (
    productID TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    productType TEXT NOT NULL
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    orderID INTEGER PRIMARY KEY,
    userID TEXT NOT NULL,
    productID TEXT NOT NULL,
    purchaseDate TEXT NOT NULL, 
    FOREIGN KEY (productID) REFERENCES products(productID)
);

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    userID INTEGER NOT NULL, 
    stripeID TEXT NOT NULL,
    FOREIGN KEY (userID) REFERENCES orders(userID),
    PRIMARY KEY (userID, stripeID)
)