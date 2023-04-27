DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    productType TEXT CHECK(
        productType IN ('Facility', 'Activity', 'Session', 'Membership')
    ) NOT NULL
);
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    purchaseDate TEXT NOT NULL,
    expiryDate TEXT,
    receipt_pdf TEXT,
    booking_id INTEGER,
    purchase_price TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    user_id INTEGER NOT NULL,
    stripe_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES orders(user_id),
    PRIMARY KEY (user_id, stripe_id)
);
DROP TABLE IF EXISTS pending;
CREATE TABLE pending (
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    starts TEXT NOT NULL,
    checkout_id TEXT NOT NULL,
    PRIMARY KEY (user_id, event_id, starts)
);