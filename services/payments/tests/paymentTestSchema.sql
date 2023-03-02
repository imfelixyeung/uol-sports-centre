DROP TABLE IF EXISTS products;

CREATE TABLE products (
    priceID TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    productType TEXT NOT NULL
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    userID INTEGER NOT NULL,
    priceID TEXT NOT NULL,
    FOREIGN KEY (priceID) REFERENCES products(priceID),
    PRIMARY KEY (userID, priceID)
);